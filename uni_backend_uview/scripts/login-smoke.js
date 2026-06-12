// 登录冒烟：captcha → smsCode → phone，全程从后端日志读码
// 用法：node scripts/login-smoke.js
const http = require('http');
const fs = require('fs');

const PHONE = '18664378720';
const LOG_FILE = 'C:\\Users\\li\\AppData\\Local\\Temp\\backend.log';

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      host: '127.0.0.1', port: 8002, path, method: 'POST',
      headers: {'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data)},
    }, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({status: res.statusCode, body: JSON.parse(buf)}));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:8002' + path, res => {
      let buf = '';
      res.on('data', c => buf += c);
      res.on('end', () => resolve({status: res.statusCode, body: JSON.parse(buf)}));
    }).on('error', reject);
  });
}

function readLastLogMatch(regex) {
  const log = fs.readFileSync(LOG_FILE, 'utf8');
  const lines = log.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const m = lines[i].match(regex);
    if (m) return m;
  }
  return null;
}

(async () => {
  // 1) 拿 captcha
  const cap = await get('/app/user/login/captcha');
  const captchaId = cap.body.data.captchaId;
  console.log('1) captcha:', captchaId);

  // 2) 从日志读 captchaText（最新一条带此 captchaId 的）
  const m1 = readLastLogMatch(new RegExp(`captchaId=${captchaId}, captchaText=(\\w+)`));
  if (!m1) throw new Error('日志里找不到 captcha 文字');
  const captchaText = m1[1];
  console.log('   captchaText:', captchaText);

  // 3) 发短信
  const sms = await post('/app/user/login/smsCode', {phone: PHONE, captchaId, code: captchaText});
  console.log('2) smsCode result:', JSON.stringify(sms.body));

  // 4) 从日志读短信码（"验证码: XXXX"）
  const m2 = readLastLogMatch(/验证码: (\d{4})/);
  if (!m2) throw new Error('日志里找不到短信验证码');
  const smsCode = m2[1];
  console.log('   smsCode:', smsCode);

  // 5) 登录
  const login = await post('/app/user/login/phone', {phone: PHONE, smsCode});
  console.log('3) login status:', login.status);
  console.log('   login body:', JSON.stringify(login.body, null, 2));

  if (login.body.code === 1000) {
    const token = login.body.data.token;
    console.log('\n   ✅ TOKEN =', token);
    // 写到文件供后续业务测试用
    fs.writeFileSync(__dirname + '/.token.txt', token, 'utf8');
  } else {
    console.log('\n   ❌ 登录失败');
  }
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
