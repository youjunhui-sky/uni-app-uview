// 获取 captcha 并保存 SVG 到文件，等用户读取文字
// 用法：node scripts/get-captcha.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, 'captcha-current.svg');

http.get('http://127.0.0.1:8002/app/user/login/captcha', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const resp = JSON.parse(data);
    const b64 = resp.data.data.split(',')[1];  // data:image/svg+xml;base64,XXX
    const svg = Buffer.from(b64, 'base64').toString('utf8');
    fs.writeFileSync(out, svg, 'utf8');
    console.log('captchaId:', resp.data.captchaId);
    console.log('SVG saved to:', out);
    console.log('\n请打开 SVG 文件查看文字，把文字告诉我即可。');
  });
}).on('error', e => console.error(e.message));
