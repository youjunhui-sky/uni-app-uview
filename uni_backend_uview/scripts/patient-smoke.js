// 就诊人流程冒烟测试：登录 → 我的 → 切换就诊人 → 新增 → 编辑 → 设为默认 → 删除
// 用法：先 node scripts/login-smoke.js 拿到 .token.txt，再 node scripts/patient-smoke.js
const http = require('http');
const fs = require('fs');

const TOKEN = fs.readFileSync(__dirname + '/.token.txt', 'utf8').trim();
const PHONE = '18664378720';
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
    ? JSON.stringify(resp.body.data).substring(0, 160)
    : '';
  console.log(`  ${tag} ${name} → code=${resp.body?.code} ${resp.body?.message || ''}`);
  if (preview) console.log(`     data: ${preview}${preview.length >= 160 ? '...' : ''}`);
  return { passed, data: resp.body?.data };
}

// 随机生成一个有效身份证号（仅用于联调，校验码位不严格）
// 格式: 6位区码 + 8位生日(YYYYMMDD) + 3位顺序 + 1位校验 = 18位
function fakeIdCard(seed) {
  const region = '110105'; // 北京朝阳
  const yyyy = '1990';
  const mm = String(((seed % 12) + 1)).padStart(2, '0');
  const dd = '15';
  const seq = String((seed % 1000)).padStart(3, '0');
  return `${region}${yyyy}${mm}${dd}${seq}0`;  // 18 位
}

(async () => {
  console.log('=== 就诊人流程冒烟测试 ===\n');

  // 0) 拿个人信息（拿到 userId）
  console.log('--- 0) GET /app/user/info/person ---');
  const me = await call('GET', '/app/user/info/person', null);
  const person = check('person', me);
  if (!person.passed) { console.log('⛔ 拿不到 userInfo，退出'); return; }
  const userId = person.data?.id;
  console.log('     userId =', userId, '\n');

  // 1) "我的页" 一进来拿当前就诊人
  console.log('--- 1) POST /app/patient/patientUser/getCurrentPatient (我的页 onShow) ---');
  const cur = await call('POST', '/app/patient/patientUser/getCurrentPatient', { userId });
  const curR = check('getCurrentPatient', cur);
  console.log('     当前就诊人:', curR.data?.name || '(无)', 'patientNo=' + curR.data?.patientNo, '\n');

  // 2) "切换就诊人" 入口：拿就诊人列表
  console.log('--- 2) POST /app/patient/patientUser/getByUserId (切换就诊人列表) ---');
  const list = await call('POST', '/app/patient/patientUser/getByUserId', { userId });
  const listR = check('getByUserId', list);
  const patients = listR.data || [];
  console.log(`     共 ${patients.length} 个就诊人\n`);

  // 3) 查档案号（用现有 patientNo 测试 getByUserIdAndPatientNo）
  if (patients.length > 0) {
    console.log('--- 3) POST /app/patient/patientUser/getByUserIdAndPatientNo ---');
    const found = patients[0].patientNo;
    const r = await call('POST', '/app/patient/patientUser/getByUserIdAndPatientNo', { userId, patientNo: found });
    check('getByUserIdAndPatientNo', r);
    console.log('');
  }

  // 4) 新增就诊人（用全新 idCard，避免与历史数据冲突）
  const seed = Date.now() % 100000;
  const newIdCard = fakeIdCard(seed);
  const newName = `冒烟测试_${seed}`;
  console.log('--- 4) POST /app/patient/patientUser/addPatientUser (新增就诊人) ---');
  console.log('     入参:', { name: newName, idCard: newIdCard, mobile: '13800138000', default: 1 });
  const add = await call('POST', '/app/patient/patientUser/addPatientUser', {
    userId, name: newName, idCard: newIdCard, mobile: '13800138000',
    gender: '1', birthDate: '1990-01-15', occupation: 'tester', default: 1,
  });
  const addR = check('addPatientUser', add);
  const newPatientNo = addR.data?.patientNo;
  console.log('     新 patientNo =', newPatientNo, '\n');
  if (!newPatientNo) { console.log('⛔ 新增失败，退出'); return; }

  // 5) 再次拿列表，应该能看到刚才加的
  console.log('--- 5) POST /app/patient/patientUser/getByUserId (新增后) ---');
  const list2 = await call('POST', '/app/patient/patientUser/getByUserId', { userId });
  const list2R = check('getByUserId (after add)', list2);
  const patients2 = list2R.data || [];
  const justAdded = patients2.find(p => p.patientNo === newPatientNo);
  const isDefault = String(justAdded?.default) === '1';
  console.log(`     ${isDefault ? '✅' : '❌'} 新增的就诊人已是默认 (default=${justAdded?.default})`);
  console.log(`     列表长度：${patients.length} → ${patients2.length}\n`);

  // 6) 编辑：先拿到 patientId (UUID)
  console.log('--- 6) POST /app/patient/patientInfo/update (编辑职业) ---');
  const patientId = justAdded?.patientId;
  console.log('     patientId (UUID) =', patientId);
  if (patientId) {
    const upd = await call('POST', '/app/patient/patientInfo/update', {
      id: patientId, occupation: 'smoke-tester-updated',
    });
    check('update (occupation)', upd);

    // 验证一下：再查一次该 patientNo，occupation 是否更新
    const verify = await call('POST', '/app/patient/patientUser/getByUserIdAndPatientNo', { userId, patientNo: newPatientNo });
    const v = verify.body?.data?.[0];
    console.log(`     ${v?.occupation === 'smoke-tester-updated' ? '✅' : '❌'} occupation 已更新为: ${v?.occupation}`);
  }
  console.log('');

  // 7) 切换默认：把刚加的设为默认（应该已经默认了，再 set 一次走一遍链路）
  console.log('--- 7) POST /app/patient/patientUser/updateDefault (设为当前就诊人) ---');
  // 后端期望 patientNo（档案号），不是 tpatient_user.id
  const setDef = await call('POST', '/app/patient/patientUser/updateDefault', {
    userId, patientNo: newPatientNo,
  });
  check('updateDefault', setDef);

  // 验证：再调 getCurrentPatient 应该拿到这条
  const cur2 = await call('POST', '/app/patient/patientUser/getCurrentPatient', { userId });
  const cur2R = check('getCurrentPatient (after set)', cur2);
  const isNewCurrent = cur2R.data?.patientNo === newPatientNo;
  console.log(`     ${isNewCurrent ? '✅' : '❌'} 当前就诊人已切换为新增的 (${cur2R.data?.name})\n`);

  // 8) 删除刚加的（不带任何自动晋升参数，走 P0 场景）
  console.log('--- 8) POST /app/patient/patientUser/delete (删除新就诊人) ---');
  const tpId = justAdded?.id;
  console.log('     tpatient_user.id =', tpId);
  if (tpId) {
    const del = await call('POST', '/app/patient/patientUser/delete', { ids: [tpId] });
    check('delete', del);

    // 9) 删除后再查列表
    const list3 = await call('POST', '/app/patient/patientUser/getByUserId', { userId });
    const list3R = check('getByUserId (after delete)', list3);
    const stillThere = (list3R.data || []).find(p => p.patientNo === newPatientNo);
    console.log(`     ${!stillThere ? '✅' : '❌'} 新就诊人已从列表移除`);
    console.log(`     列表长度：${patients2.length} → ${list3R.data?.length}`);
  }
  console.log('');

  // 10) P0 场景：错字段名应该被后端新校验拒绝，正确字段名走通
  console.log('--- 10) 字段名校验：错字段名应拒绝 / 正确字段名应生效 ---');

  // 先加一个非默认
  const newIdCard3 = fakeIdCard(seed + 2);
  const newName3 = `冒烟测试3_${seed + 2}`;
  const add3 = await call('POST', '/app/patient/patientUser/addPatientUser', {
    userId, name: newName3, idCard: newIdCard3, mobile: '13800138002',
    gender: '2', birthDate: '1990-02-15', occupation: 'tester', default: 0,
  });
  const add3R = check('addPatientUser (非默认)', add3);
  const newNo3 = add3R.data?.patientNo;
  console.log('     非默认 patientNo =', newNo3);

  // 模拟前端 bug：不传 patientNo，传个不存在的字段
  const bugCall = await call('POST', '/app/patient/patientUser/updateDefault', {
    userId, patientUserId: newNo3,  // 旧版字段名
  });
  // 修复后应该被后端校验拒绝（code != 1000）
  if (bugCall.body?.code === 1000) {
    console.log('  ❌ 字段名错位仍被静默接受 (code=1000)');
  } else {
    console.log(`  ✅ 字段名错位被拒绝 → code=${bugCall.body?.code} msg=${bugCall.body?.message}`);
  }

  // 用正确字段名
  const goodCall = await call('POST', '/app/patient/patientUser/updateDefault', {
    userId, patientNo: newNo3,  // 新版字段名
  });
  check('updateDefault (patientNo 字段)', goodCall);

  // 验证：当前就诊人应该是 newNo3
  const cur3 = await call('POST', '/app/patient/patientUser/getCurrentPatient', { userId });
  const cur3R = check('getCurrentPatient (after correct set)', cur3);
  console.log(`     ${cur3R.data?.patientNo === newNo3 ? '✅' : '❌'} 当前就诊人是 newNo3\n`);

  // 10b) 静默失败防御：传一个不存在的 patientNo → 应被新校验拒
  console.log('--- 10b) 静默失败防御：传不存在的 patientNo ---');
  const ghostCall = await call('POST', '/app/patient/patientUser/updateDefault', {
    userId, patientNo: 'NOT_EXIST_999999',
  });
  if (ghostCall.body?.code === 1000) {
    console.log('  ❌ 不存在的 patientNo 仍被静默接受 (code=1000)');
  } else {
    console.log(`  ✅ 不存在的 patientNo 被拒绝 → code=${ghostCall.body?.code} msg=${ghostCall.body?.message}`);
  }

  // 11) 安全检查：getByIdCardAndName 是否要 token？
  console.log('--- 11) P1 安全检查：getByIdCardAndName 不带 token ---');
  const leak = await call('POST', '/app/patient/patientInfo/getByIdCardAndName', {
    idCard: '110105199001011990', name: '张三',
  }, false);
  if (leak.status === 401 || (leak.body && leak.body.code === 401)) {
    console.log('  ✅ 无 token 被拒绝');
  } else if (leak.body?.code === 1000) {
    console.log('  ❌ 无 token 仍可查到数据！code=' + leak.body.code);
  } else {
    console.log('  ⚠️  状态码=' + leak.status + ' body.code=' + leak.body?.code);
  }

  console.log('\n=== 冒烟完成 ===');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
