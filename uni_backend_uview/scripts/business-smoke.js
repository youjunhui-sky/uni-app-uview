// 业务接口冒烟测试：拿 token 调所有业务接口，验证 base/mua 跨 schema 查询
const http = require('http');
const fs = require('fs');

const TOKEN = fs.readFileSync(__dirname + '/.token.txt', 'utf8').trim();
const USER_ID = 3;
const PHONE = '18664378720';

function call(method, path, body, useToken = true) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const headers = {'Content-Type': 'application/json'};
    if (data) headers['Content-Length'] = Buffer.byteLength(data);
    if (useToken) headers['Authorization'] = 'Bearer ' + TOKEN;
    const req = http.request({host: '127.0.0.1', port: 8002, path, method, headers}, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => {
        try { resolve({status: res.statusCode, body: JSON.parse(buf)}); }
        catch (e) { resolve({status: res.statusCode, body: buf}); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function ok(name, resp, expectCode = 1000) {
  const passed = resp.body && resp.body.code === expectCode;
  if (passed) {
    console.log(`  ✅ ${name} → code=${resp.body.code}`);
    if (resp.body.data !== undefined) {
      const preview = JSON.stringify(resp.body.data).substring(0, 200);
      console.log(`     data: ${preview}${preview.length >= 200 ? '...' : ''}`);
    }
  } else {
    console.log(`  ❌ ${name} → code=${resp.body?.code}, msg=${resp.body?.message}`);
  }
  return passed;
}

(async () => {
  console.log('=== 业务接口冒烟测试 (token userId=' + USER_ID + ') ===\n');

  // 1) /app/user/info/person - 拿个人信息（base.tuser_info）
  console.log('--- 1) /app/user/info/person ---');
  await call('GET', '/app/user/info/person', null).then(r => ok('person', r));

  // 2) /app/patient/patientUser/getByUserId - 拿就诊人（base.tpatient_user JOIN base.tbus_patient_info）
  console.log('\n--- 2) /app/patient/patientUser/getByUserId ---');
  await call('POST', '/app/patient/patientUser/getByUserId', {}).then(r => ok('getByUserId', r));

  // 3) /app/patient/patientUser/getByUserIdAndPatientNo
  console.log('\n--- 3) /app/patient/patientUser/getByUserIdAndPatientNo ---');
  // 拿一个已有的 patientNo 测试（从前一步返回里取，如果有）
  // 先直接用任一 patientNo 试
  await call('POST', '/app/patient/patientUser/getByUserIdAndPatientNo', {userId: USER_ID, patientNo: 'TEST_NO_001'})
    .then(r => ok('getByUserIdAndPatientNo (空数据)', r));

  // 4) /app/patient/patientInfo/update - 更新患者（base.tbus_patient_info）
  console.log('\n--- 4) /app/patient/patientInfo/update ---');
  // UUID 格式的 id
  await call('POST', '/app/patient/patientInfo/update', {id: '00000000-0000-0000-0000-000000000000', name: '测试'})
    .then(r => ok('update (不存在的 uuid)', r));

  // 5) /app/questionnaire/questionnaire/questionsWithOptions - 拉问卷（base.*）
  console.log('\n--- 5) /app/questionnaire/questionnaire/questionsWithOptions ---');
  await call('POST', '/app/questionnaire/questionnaire/questionsWithOptions', {id: 1})
    .then(r => ok('questionsWithOptions id=1', r));

  // 6) /app/etiology/muaInfo/getMuaInfoByPatientNo - 拉代谢评估（mua schema）
  console.log('\n--- 6) /app/etiology/muaInfo/getMuaInfoByPatientNo ---');
  await call('POST', '/app/etiology/muaInfo/getMuaInfoByPatientNo', {patientNo: 'NOT_EXIST_NO'})
    .then(r => ok('getMuaInfoByPatientNo (空数据)', r));

  // 7) /app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo
  console.log('\n--- 7) /app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo ---');
  await call('POST', '/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo', {patientNo: 'NOT_EXIST_NO', swlNo: 'NOT_EXIST'})
    .then(r => ok('getMuaContentByPatientNoAndSwlNo (空数据)', r));

  // 8) /app/dict/info/types - 字典类型（base.tsys_dict_type）
  console.log('\n--- 8) /app/dict/info/types ---');
  await call('POST', '/app/dict/info/types', {}).then(r => ok('types', r));

  // 9) /app/dict/info/data - 字典数据（base.tsys_dict_info）
  console.log('\n--- 9) /app/dict/info/data ---');
  await call('POST', '/app/dict/info/data', {types: ['lithiasis_diagnose']}).then(r => ok('data', r));

  // 10) /app/base/comm/param - 系统参数（base.tsys_param）
  console.log('\n--- 10) /app/base/comm/param ---');
  await call('GET', '/app/base/comm/param?key=questionnaireId', null).then(r => ok('param key=questionnaireId', r));

  // 11) 不带 token 访问业务接口 - 应该 401
  console.log('\n--- 11) 无 token 访问 (期望 401) ---');
  await call('GET', '/app/user/info/person', null, false).then(r => {
    if (r.status === 401 || (r.body && r.body.code === 401)) console.log('  ✅ 无 token 拒绝');
    else console.log('  ❌ 无 token 仍可访问: ' + r.status);
  });

  console.log('\n=== 业务冒烟完成 ===');
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
