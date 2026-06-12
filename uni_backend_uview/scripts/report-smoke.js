// 查看报告流程冒烟：列表 → 详情 → 安全检查
// 用法：先 node scripts/login-smoke.js 拿到 .token.txt，再 node scripts/report-smoke.js
const http = require('http');
const fs = require('fs');

const TOKEN = fs.readFileSync(__dirname + '/.token.txt', 'utf8').trim();
const PORT = 8002;

function call(method, path, body, useToken = true) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = { 'Content-Type': 'application/json' };
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (useToken) headers['Authorization'] = 'Bearer ' + TOKEN;
    const req = http.request({ host: '127.0.0.1', port: PORT, path, method, headers }, res => {
      let buf = '';
      res.on('data', c => (buf += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(buf) }); }
        catch (e) { resolve({ status: res.statusCode, body: buf }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function check(name, resp, expectCode = 1000) {
  const passed = resp.body && resp.body.code === expectCode;
  const tag = passed ? '✅' : '❌';
  const preview = resp.body?.data !== undefined
    ? JSON.stringify(resp.body.data).substring(0, 200)
    : '';
  console.log(`  ${tag} ${name} → code=${resp.body?.code} ${resp.body?.message || ''}`);
  if (preview) console.log(`     data: ${preview}${preview.length >= 200 ? '...' : ''}`);
  return { passed, data: resp.body?.data };
}

(async () => {
  console.log('=== 查看报告流程冒烟 ===\n');

  // 0) 准备：先在 user 3 自己的就诊人下插一条 SMOKE mua 样本
  // （修复隐私洞后，user 3 只能读自己 patient_no 下的 mua 数据）
  console.log('--- 0) 准备：给 user 3 自己的 patientNo 插一条 SMOKE mua 样本 ---');
  const pg = require('pg');
  const pgc = new pg.Client({ host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp' });
  await pgc.connect();
  const ownPatient = await pgc.query(
    `SELECT patient_no FROM base.tpatient_user WHERE user_id=3 ORDER BY id DESC LIMIT 1`
  );
  const ownPatientNo = ownPatient.rows[0]?.patient_no;
  if (!ownPatientNo) {
    console.log('⛔ user 3 没有 patientNo，退出');
    await pgc.end();
    return;
  }
  // 清掉旧的 SMOKE 数据，重插
  await pgc.query(`DELETE FROM mua.tetiology_mua_info WHERE mua_no='SMOKE001'`);
  await pgc.query(`DELETE FROM mua.tetiology_mua_content WHERE mua_no='SMOKE001'`);
  await pgc.query(
    `INSERT INTO mua.tetiology_mua_info
     (patient_no, mua_no, serial_number, assessment_count, assessment_type, assessment_date, age, height, weight, bmi, doctor)
     VALUES ($1, 'SMOKE001', 'smoke-001', 1, 'mua2', now(), '35岁', 170, 70, 24.2, '冒烟医生')`,
    [ownPatientNo]
  );
  await pgc.query(
    `INSERT INTO mua.tetiology_mua_content
     (patient_no, mua_no, serial_number, assessment_count, assessment_type, assessment_result, ai_guide_suggestion, treatment_suggestion, guide_suggestion)
     VALUES ($1, 'SMOKE001', 'smoke-001', 1, 'mua2', '测试结果', '冒烟AI建议', '冒烟治疗建议', '冒烟饮食建议')`,
    [ownPatientNo]
  );
  const sampleInfo = {
    mua_no: 'SMOKE001',
    patient_no: ownPatientNo,
    assessment_count: 1,
    assessment_type: 'mua2',
  };
  console.log(`     ✅ 样本插入: mua_no=${sampleInfo.mua_no}, patient_no=${sampleInfo.patient_no}`);
  await pgc.end();
  console.log('');

  // 1) 列表：用自己的 token 查 sample patientNo 的 mua_info
  console.log('--- 1) POST /app/etiology/muaInfo/getMuaInfoByPatientNo (有数据的 patientNo) ---');
  const list1 = await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', {
    patientNo: sampleInfo.patient_no,
  });
  const list1R = check('getMuaInfoByPatientNo', list1);
  const list = list1R.data || [];
  console.log(`     返回 ${list.length} 条 mua_info`);
  const first = list[0] || {};
  const fieldCheck = ['id', 'patientNo', 'swlNo', 'assessmentCount', 'assessmentDate', 'assessmentType'].every(k => k in first);
  console.log(`     ${fieldCheck ? '✅' : '❌'} 字段齐全 (id/patientNo/swlNo/assessmentCount/assessmentDate/assessmentType)`);
  console.log('');

  // 2) 列表：user 3 自己的但无 mua 数据的 patientNo → 应返回 []
  console.log('--- 2) 列表：user 3 自己的无 mua 数据的 patientNo ---');
  // 找一个 user 3 绑定的，但没有 mua 数据的 patientNo
  const pgc3 = new pg.Client({ host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp' });
  await pgc3.connect();
  const emptyPat = await pgc3.query(
    `SELECT tpu.patient_no FROM base.tpatient_user tpu
     WHERE tpu.user_id=3
       AND NOT EXISTS (SELECT 1 FROM mua.tetiology_mua_info a WHERE a.patient_no=tpu.patient_no AND a.deleted_at IS NULL)
     ORDER BY tpu.id DESC LIMIT 1`
  );
  const emptyPatientNo = emptyPat.rows[0]?.patient_no;
  await pgc3.end();
  if (emptyPatientNo) {
    const list2 = await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', { patientNo: emptyPatientNo });
    const list2R = check('getMuaInfoByPatientNo (空数据)', list2);
    const isEmpty = Array.isArray(list2R.data) && list2R.data.length === 0;
    console.log(`     ${isEmpty ? '✅' : '❌'} 返回 []（实际: ${JSON.stringify(list2R.data).slice(0, 100)}）`);
  } else {
    console.log('  ⚠️  user 3 没有"有绑定但无 mua 数据"的 patientNo，跳过');
  }
  console.log('');

  // 3) 列表：不传 patientNo
  console.log('--- 3) 列表：不传 patientNo ---');
  const list3 = await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', {});
  if (list3.body?.code === 1000) {
    const r = list3.body?.data;
    console.log(`  ⚠️  返回 1000 (data: ${JSON.stringify(r)?.slice(0, 80)}) — 接口允许空 patientNo 通过`);
  } else {
    console.log(`  ✅ 不传 patientNo 被拒 → code=${list3.body?.code} msg=${list3.body?.message}`);
  }
  console.log('');

  // 4) 详情：sample mua_content
  console.log('--- 4) POST /app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo ---');
  const det1 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', {
    patientNo: sampleInfo.patient_no,
    swlNo: sampleInfo.mua_no,
    assessmentCount: sampleInfo.assessment_count,
    assessmentType: sampleInfo.assessment_type,
  });
  const det1R = check('getMuaContentByPatientNoAndSwlNo', det1);
  const content = det1R.data || null;
  if (content) {
    const cFieldCheck = ['id', 'patientNo', 'swlNo', 'assessmentResult', 'aiGuideSuggestion'].every(k => k in content);
    console.log(`     ${cFieldCheck ? '✅' : '❌'} 字段齐全 (id/patientNo/swlNo/assessmentResult/aiGuideSuggestion)`);
    console.log(`     aiGuideSuggestion: ${content.aiGuideSuggestion ? '有内容' : '空'}`);
  } else {
    console.log('     ⚠️  返回 null（库里可能没 content 行）');
  }
  console.log('');

  // 5) 详情：只传 patientNo + swlNo（不传 assessmentCount / assessmentType）
  console.log('--- 5) 详情：只传 patientNo + swlNo ---');
  const det2 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', {
    patientNo: sampleInfo.patient_no,
    swlNo: sampleInfo.mua_no,
  });
  const det2R = check('getMuaContentByPatientNoAndSwlNo (少参)', det2);
  console.log(`     ${det2R.data ? '✅ 仍能匹配到一条 (service 已 orderBy+limit 1 兜底)' : '⚠️  返回 null'}`);
  console.log('');

  // 6) 详情：不存在的 muaNo
  console.log('--- 6) 详情：不存在的 muaNo ---');
  const det3 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', {
    patientNo: sampleInfo.patient_no,
    swlNo: 'GHOST_MUA_9999',
  });
  if (det3.body?.code === 1000 && det3.body?.data === null) {
    console.log('  ✅ 返回 null');
  } else {
    console.log(`  ⚠️  行为: code=${det3.body?.code} data=${JSON.stringify(det3.body?.data)?.slice(0, 80)}`);
  }
  console.log('');

  // 7) 安全：缺 patientNo / 缺 swlNo
  console.log('--- 7) 安全：缺 patientNo / swlNo ---');
  const det4 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', { swlNo: 'X' });
  if (det4.body?.code === 1000) {
    console.log('  ⚠️  缺 patientNo 仍被接受');
  } else {
    console.log(`  ✅ 缺 patientNo 被拒 → code=${det4.body?.code}`);
  }
  const det5 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', { patientNo: 'X' });
  if (det5.body?.code === 1000) {
    console.log('  ⚠️  缺 swlNo 仍被接受');
  } else {
    console.log(`  ✅ 缺 swlNo 被拒 → code=${det5.body?.code}`);
  }
  console.log('');

  // 8) 安全：无 token
  console.log('--- 8) 无 token 访问 ---');
  const noTok1 = await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', { patientNo: 'X' }, false);
  if (noTok1.status === 401 || noTok1.body?.code === 401) {
    console.log('  ✅ 列表接口无 token 被拒');
  } else {
    console.log(`  ❌ 列表无 token 仍可访问: status=${noTok1.status}`);
  }
  const noTok2 = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', { patientNo: 'X', swlNo: 'X' }, false);
  if (noTok2.status === 401 || noTok2.body?.code === 401) {
    console.log('  ✅ 详情接口无 token 被拒');
  } else {
    console.log(`  ❌ 详情无 token 仍可访问: status=${noTok2.status}`);
  }
  console.log('');

  // 9) 隐私洞：跨用户读取（用自己 token 查别人 patientNo 的数据）
  console.log('--- 9) 隐私洞：跨用户读 ---');
  // 先取一个 userId != 3 的 patient 的 mua_no
  const pgc2 = new pg.Client({ host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp' });
  await pgc2.connect();
  const otherUser = await pgc2.query(
    `SELECT a.mua_no, a.patient_no, a.assessment_count, a.assessment_type
     FROM mua.tetiology_mua_info a
     WHERE a.deleted_at IS NULL AND a.patient_no NOT IN (SELECT patient_no FROM base.tpatient_user WHERE user_id=3)
     ORDER BY a.assessment_date DESC LIMIT 1`
  );
  const other = otherUser.rows[0];
  await pgc2.end();

  if (!other) {
    console.log('  ⚠️  库中没有其他用户的 mua 数据，跳过此检查');
  } else {
    console.log(`     尝试用 userId=3 的 token 查 patient_no=${other.patient_no} 的数据`);
    const crossList = await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', { patientNo: other.patient_no });
    if (crossList.body?.code === 1000 && Array.isArray(crossList.body?.data) && crossList.body.data.length > 0) {
      console.log(`  ❌ 隐私洞：跨用户能读到 ${crossList.body.data.length} 条别人数据！`);
    } else if (crossList.body?.code !== 1000) {
      console.log(`  ✅ 跨用户被拒 → code=${crossList.body?.code}`);
    } else {
      console.log(`  ✅ 跨用户返回空（实际 data: ${JSON.stringify(crossList.body?.data)}）`);
    }

    const crossDet = await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', {
      patientNo: other.patient_no, swlNo: other.mua_no,
    });
    if (crossDet.body?.code === 1000 && crossDet.body?.data) {
      console.log(`  ❌ 详情隐私洞：能读到别人的 mua_content！`);
    } else if (crossDet.body?.code !== 1000) {
      console.log(`  ✅ 详情跨用户被拒 → code=${crossDet.body?.code}`);
    } else {
      console.log(`  ✅ 详情跨用户返回 null`);
    }
  }

  console.log('\n=== 查看报告冒烟完成 ===');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
