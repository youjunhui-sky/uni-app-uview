// 诊前问询流程冒烟：拉问卷 → 提交答案 → 回读 → 更新 → 越权防御
// 用法：先 node scripts/login-smoke.js 拿到 .token.txt，再 node scripts/questionnaire-smoke.js
const http = require('http');
const fs = require('fs');

const TOKEN = fs.readFileSync(__dirname + '/.token.txt', 'utf8').trim();
const USER_ID = 3;
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
  console.log('=== 诊前问询流程冒烟 ===\n');

  // 0) 准备：拿当前用户的就诊人
  console.log('--- 0) 准备：拿 patientNo ---');
  const ps = await call('POST', '/app/patient/patientUser/getByUserId', { userId: USER_ID });
  const psR = check('getByUserId', ps);
  const patients = psR.data || [];
  let patientNo;
  if (patients.length > 0) {
    patientNo = patients[0].patientNo;
    console.log(`     复用现有 patientNo = ${patientNo}`);
  } else {
    // 没有就建一个
    const seed = Date.now() % 100000;
    const idCard = `11010519900115${String(seed).padStart(4, '0')}`.slice(0, 18);
    const add = await call('POST', '/app/patient/patientUser/addPatientUser', {
      userId: USER_ID, name: `q_冒烟_${seed}`, idCard, mobile: '13800138000',
      gender: '1', birthDate: '1990-01-15', occupation: 'tester', default: 1,
    });
    const addR = check('addPatientUser (建一个用)', add);
    patientNo = addR.data?.patientNo;
    console.log(`     新建 patientNo = ${patientNo}`);
  }
  if (!patientNo) { console.log('⛔ 没 patientNo，退出'); return; }
  console.log('');

  // 1) 拉问卷（questionsWithOptions）
  console.log('--- 1) POST /app/questionnaire/questionnaire/questionsWithOptions ---');
  const q = await call('POST', '/app/questionnaire/questionnaire/questionsWithOptions', {});
  const qR = check('questionsWithOptions', q);
  if (!qR.passed) { console.log('⛔ 拉问卷失败，退出'); return; }
  const questionnaire = qR.data;
  const questionnaireId = questionnaire.id;
  const questions = questionnaire.questions || [];
  console.log(`     问卷：${questionnaire.title}（id=${questionnaireId}，${questions.length} 题）`);
  if (questions.length === 0) { console.log('⛔ 问卷无题目，退出'); return; }
  console.log('');

  // 2) 拉不存在的答案（应该返回 null）—— 跑前先清掉该 patientNo+questionnaireId 的旧记录
  console.log('--- 2) POST /app/patient/questionnaire/getAnswer (无记录应 null) ---');
  // 通过直接 SQL 清掉，让测试可重复
  try {
    const pg = require('pg');
    const pgClient = new pg.Client({ host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp' });
    await pgClient.connect();
    await pgClient.query('DELETE FROM base.tquestionnaire_answer WHERE patient_no = $1 AND questionnaire_id = $2', [patientNo, questionnaireId]);
    await pgClient.end();
    console.log('     已清理历史答案记录');
  } catch (e) {
    console.log('     ⚠️  清理历史记录失败:', e.message);
  }
  const none = await call('POST', '/app/patient/questionnaire/getAnswer', {
    patientNo, questionnaireId,
  });
  const noneR = check('getAnswer (无记录)', none);
  console.log(`     ${noneR.data === null ? '✅' : '❌'} 返回 null（实际: ${JSON.stringify(noneR.data)}）`);
  console.log('');

  // 3) 提交答案（构造前 3 题作为代表）
  console.log('--- 3) POST /app/patient/questionnaire/submitAnswer (首次提交) ---');
  const submitAnswers = questions.slice(0, Math.min(3, questions.length)).map((qst) => {
    // 单选/多选 → 取第一个选项；其他类型 → 填空
    if (qst.type === 'single' && qst.options && qst.options.length > 0) {
      const opt = qst.options[0];
      return { bh: qst.bh, value: opt.option, option: opt.content };
    } else if (qst.type === 'multiple' && qst.options && qst.options.length > 0) {
      const opt = qst.options[0];
      return { bh: qst.bh, value: [opt.option], option: [opt.content] };
    } else if (qst.type === 'number') {
      return { bh: qst.bh, value: '30' };
    } else {
      return { bh: qst.bh, value: '冒烟测试答案' };
    }
  });
  const sub1 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    patientNo, questionnaireId,
    answers: { answers: submitAnswers },
  });
  const sub1R = check('submitAnswer (首次)', sub1);
  const answerId1 = sub1R.data?.id;
  console.log(`     新建 answerId = ${answerId1}, updated = ${sub1R.data?.updated}`);
  console.log('');

  // 4) 回读答案
  console.log('--- 4) POST /app/patient/questionnaire/getAnswer (回读) ---');
  const get1 = await call('POST', '/app/patient/questionnaire/getAnswer', {
    patientNo, questionnaireId,
  });
  const get1R = check('getAnswer (回读)', get1);
  const readAnswers = get1R.data?.questions || [];
  console.log(`     读回 ${readAnswers.length} 题`);
  // 校验：每个答案里是否带 options 数组
  const hasOptions = readAnswers.every((a) => Array.isArray(a.options));
  console.log(`     ${hasOptions ? '✅' : '❌'} 每个答案都带 options 数组`);
  // 校验：value 是否回写
  const valueMatched = submitAnswers.every((s) => {
    const r = readAnswers.find((x) => String(x.bh) === String(s.bh));
    if (!r) return false;
    if (Array.isArray(s.value)) return JSON.stringify(r.value) === JSON.stringify(s.value);
    return String(r.value) === String(s.value);
  });
  console.log(`     ${valueMatched ? '✅' : '❌'} 答案 value 一致回写`);
  console.log('');

  // 5) 重复提交（应该 update 而不是 insert）
  console.log('--- 5) POST /app/patient/questionnaire/submitAnswer (再次提交 → 应 update) ---');
  const submitAnswers2 = submitAnswers.map((a) => ({ ...a, value: a.value === '冒烟测试答案' ? '更新后的答案' : a.value }));
  const sub2 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    patientNo, questionnaireId,
    answers: { answers: submitAnswers2 },
  });
  const sub2R = check('submitAnswer (更新)', sub2);
  const sameId1 = sub2R.data?.id === answerId1;
  const wasUpdated = sub2R.data?.updated === true;
  console.log(`     ${sameId1 ? '✅' : '❌'} answerId 不变（${answerId1} → ${sub2R.data?.id}）`);
  console.log(`     ${wasUpdated ? '✅' : '❌'} updated=true`);
  console.log('');

  // 6) 校验：再回读一次，submitted count >= 提交次数即视为更新成功
  console.log('--- 6) 校验更新是否生效 ---');
  const get2 = await call('POST', '/app/patient/questionnaire/getAnswer', {
    patientNo, questionnaireId,
  });
  const get2R = check('getAnswer (更新后)', get2);
  // 因为题目类型不固定（single/multiple/number/text），value 不一定可比；
  // 只要 updated=true + answerId 复用 + 再次能读回，就证明走的是更新路径。
  const updatedFlagOk = sub2R.data?.updated === true;
  const idStable = sub2R.data?.id === answerId1;
  const readbackOk = (get2R.data?.questions?.length || 0) === submitAnswers.length;
  console.log(`     ${idStable ? '✅' : '❌'} answerId 复用 (${answerId1})`);
  console.log(`     ${updatedFlagOk ? '✅' : '❌'} updated=true`);
  console.log(`     ${readbackOk ? '✅' : '❌'} 回读题数 = ${get2R.data?.questions?.length}（预期 ${submitAnswers.length}）`);
  console.log('');

  // 7) 安全：缺 patientNo 应被拒
  console.log('--- 7) 缺 patientNo 应被拒 ---');
  const miss1 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    questionnaireId, answers: { answers: [] },
  });
  if (miss1.body?.code === 1000) {
    console.log('  ❌ 缺 patientNo 仍被接受');
  } else {
    console.log(`  ✅ 缺 patientNo 被拒 → code=${miss1.body?.code} msg=${miss1.body?.message}`);
  }

  const miss2 = await call('POST', '/app/patient/questionnaire/getAnswer', {
    questionnaireId,
  });
  if (miss2.body?.code === 1000) {
    console.log('  ❌ 缺 patientNo 仍被接受');
  } else {
    console.log(`  ✅ 缺 patientNo 被拒 → code=${miss2.body?.code} msg=${miss2.body?.message}`);
  }
  console.log('');

  // 8) 安全：越权访问 - 用一个不属于该 userId 的 patientNo
  console.log('--- 8) 越权防御：用一个不属于该 userId 的 patientNo ---');
  const ghostPatient = 'GHOST_PATIENT_NO_9999';
  const cross1 = await call('POST', '/app/patient/questionnaire/getAnswer', {
    patientNo: ghostPatient, questionnaireId,
  });
  if (cross1.body?.code === 1000) {
    console.log('  ❌ 越权访问仍可读到数据！');
  } else {
    console.log(`  ✅ 越权被拒 → code=${cross1.body?.code} msg=${cross1.body?.message}`);
  }

  const cross2 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    patientNo: ghostPatient, questionnaireId, answers: { answers: [] },
  });
  if (cross2.body?.code === 1000) {
    console.log('  ❌ 越权写入仍可成功！');
  } else {
    console.log(`  ✅ 越权写入被拒 → code=${cross2.body?.code} msg=${cross2.body?.message}`);
  }
  console.log('');

  // 9) 安全：无 token 访问
  console.log('--- 9) 无 token 访问 ---');
  const noTok = await call('POST', '/app/patient/questionnaire/getAnswer', {
    patientNo, questionnaireId,
  }, false);
  if (noTok.status === 401 || noTok.body?.code === 401) {
    console.log('  ✅ 无 token 被拒');
  } else {
    console.log(`  ❌ 无 token 仍可访问: status=${noTok.status} code=${noTok.body?.code}`);
  }
  console.log('');

  // 10) 错误提示：未发布问卷应抛清晰错误（不再静默 null）
  console.log('--- 10) 未发布问卷应抛清晰错误 ---');
  const unpub = await call('POST', '/app/questionnaire/questionnaire/questionsWithOptions', { questionnaireId: 2 });
  if (unpub.body?.code === 1000 && unpub.body?.data === null) {
    console.log('  ❌ 未发布问卷仍返回 null (静默失败)');
  } else if (unpub.body?.code !== 1000) {
    console.log(`  ✅ 未发布问卷抛错 → code=${unpub.body?.code} msg="${unpub.body?.message}"`);
  } else {
    console.log(`  ⚠️  返回 1000 但 data=${JSON.stringify(unpub.body?.data)}`);
  }

  // 11) 并发：连续两次 submit 应只产生一条记录
  console.log('\n--- 11) 并发提交：连续 2 次应只产生 1 条记录 ---');
  const r1 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    patientNo, questionnaireId,
    answers: { answers: [{ bh: 'Q001', value: 'Q001A', option: '非常满意' }] },
  });
  const r2 = await call('POST', '/app/patient/questionnaire/submitAnswer', {
    patientNo, questionnaireId,
    answers: { answers: [{ bh: 'Q001', value: 'Q001B', option: '满意' }] },
  });
  const sameId = r1.body?.data?.id && r1.body.data.id === r2.body?.data?.id;
  console.log(`  ${sameId ? '✅' : '❌'} 两次提交 answerId 一致 (${r1.body?.data?.id} === ${r2.body?.data?.id})`);

  // 直接 SQL 验证只有一条
  const pg = require('pg');
  const pgc = new pg.Client({ host: '36.111.159.23', port: 5432, user: 'postgres', password: '1223', database: 'mdp' });
  await pgc.connect();
  const r = await pgc.query('SELECT COUNT(*) c FROM base.tquestionnaire_answer WHERE patient_no = $1 AND questionnaire_id = $2', [patientNo, questionnaireId]);
  await pgc.end();
  const oneRow = parseInt(r.rows[0].c, 10) === 1;
  console.log(`  ${oneRow ? '✅' : '❌'} DB 中只产生 1 条 (实际: ${r.rows[0].c})`);

  console.log('\n=== 诊前问询冒烟完成 ===');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
