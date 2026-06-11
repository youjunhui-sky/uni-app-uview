# 项目优化计划

## 🔴 高优先级（安全 & 稳定性）

### 1. 硬编码数据库密码
- [ ] [app.module.ts:20-25](uni_backend_uview/src/app.module.ts#L20-L25) — 移除 DB host/port/user/password 默认值，强制从环境变量读取

### 2. 硬编码 JWT 密钥
- [ ] [app.module.ts:34](uni_backend_uview/src/app.module.ts#L34) 和 [jwt.strategy.ts:11](uni_backend_uview/src/common/guards/jwt.strategy.ts#L11) — 抽取统一 config，移除硬编码默认值

### 3. sms.config.example.ts 泄露密钥
- [x] ~~[sms.config.example.ts:9](uni_backend_uview/src/config/sms.config.example.ts#L9) — 清除示例文件中的真实 AccessKeySecret 片段，同时轮换阿里云 AccessKey~~ **已删除文件**

### 4. 第三方 HTTP API 泄露隐私
- [x] ~~[qrcode.ts:66](uni_frontend/utils/qrcode.ts#L66) — 非 H5 端改为本地生成二维码，避免 patientNo 泄露给 api.uomg.com~~ **已改为 uqrcodejs 本地生成**

---

## 🟡 中优先级（代码质量）

### 5. any 类型泛滥
- [ ] 为核心 API 层（useService.ts）和 store 定义 interface

### 6. useRequest.ts 和 useService.ts 重复
- [x] ~~合并 HTTP 请求逻辑，删除重复代码~~ **已删除 useRequest.ts（无引用），合并入口**

### 7. 生产环境 console.log 过多
- [x] ~~封装 logger 工具，生产环境关闭调试日志~~ **已创建 utils/logger.ts，useService.ts 已替换**

### 8. 患者页面新旧版本并存
- [ ] 删除旧版本 addPatient.vue、mgnPatient.vue

---

## 🟢 低优先级（长期改进）

### 9. 缺少 API 层类型定义
- [ ] 为每个模块定义 ApiClient interface

### 10. 无单元测试
- [ ] 为核心业务逻辑添加单元测试
