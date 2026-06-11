---
name: dev-stack-orchestrator
description: Use when user says 'start the project', 'bring up the dev env', 'run both servers', '启动项目', '跑起来', or asks about development stack layout, port numbers, or proxy configuration.
---

# dev-stack-orchestrator

## 端口与组件

| 服务 | 端口 | 启动命令 | 工作目录 |
|------|------|----------|----------|
| 前端 (Vite/H5) | 9900 | `npm run dev:h5` | `uni_frontend/` |
| 后端 (NestJS) | 8002 | `npm run start:dev` | `uni_backend_uview/` |

## 代理配置

参考 [uni_frontend/config/proxy.ts](../../uni_frontend/config/proxy.ts)：

| 前缀 | 转发到 | 用途 |
|------|--------|------|
| `/dev` | `http://127.0.0.1:8002` | 开发环境 |
| `/prod` | `https://iulm.com.cn` | 生产环境 |

`value` 字段硬编码 `"dev"`，暂未走 env。

## 启动顺序（必读）

1. **先启后端**
   ```bash
   cd uni_backend_uview
   npm run start:dev
   ```
   看到 `Application is running on: http://localhost:8002/` 即就绪。

2. **后端健康检查**
   ```bash
   curl http://localhost:8002/app/base/comm/uploadMode
   ```
   应返回 `{"code":1000, ...}`。

3. **再启前端**
   ```bash
   cd uni_frontend
   npm run dev:h5
   ```
   浏览器打开 http://localhost:9900
   DevTools Network 看 `/dev/...` 请求是否被代理到 8002。

## 类型检查

```bash
# 前端
cd uni_frontend && npx vue-tsc --noEmit -p tsconfig.json

# 后端
cd uni_backend_uview && npx tsc --noEmit -p tsconfig.json
```

## 项目待办摘要（[OPTIMIZATION.md](../../OPTIMIZATION.md)）

| 优先级 | 编号 | 状态 | 描述 |
|--------|------|------|------|
| 🔴 高 | 1 | ⏳ | 硬编码 DB 密码 → 强制从 env 读 |
| 🔴 高 | 2 | ⏳ | 硬编码 JWT 密钥 → 抽统一 config |
| 🔴 高 | 3 | ✅ | sms.config.example.ts 密钥泄露（已删） |
| 🔴 高 | 4 | ✅ | 二维码 API 第三方泄露（已改本地） |
| 🔴 高 | 5 | ✅ | Cool 命名遗留（已改 BizException） |
| 🟡 中 | 6 | ⏳ | any 类型泛滥 → 核心 API 加 interface |
| 🟡 中 | 7 | ✅ | useRequest/useService 重复（已删） |
| 🟡 中 | 8 | ✅ | console.log 过多（已统一 logger） |
| 🟡 中 | 9 | ⏳ | patient 页面新旧版本并存（删旧版） |
| 🟢 低 | 10 | ⏳ | 缺 API 层 interface |
| 🟢 低 | 11 | ⏳ | 缺单元测试 |
| 🟢 低 | 12 | ✅ | tabbar cool-js.com 死链（已清） |
| 🟢 低 | 13 | ✅ | 上传后端为 mock（已用 multer） |

## 验证清单

- [ ] 后端 8002 端口在监听（`netstat -ano | findstr 8002`）
- [ ] 前端 9900 端口在监听
- [ ] 浏览器开首页，能看到患者列表
- [ ] 选一个 patient 详情，二维码能渲染
- [ ] 头像上传流程走通（不是 [object Object]）

## 常见错误

| 症状 | 原因 | 修复 |
|------|------|------|
| 上传 500 / EXDEV | 容器 tmpfs 跨设备 | 已用 multer.diskStorage（OPT #13） |
| 后端 502 | 8002 没启 | 启后端 |
| 前端 `/uploads/xxx` 404 | `useStaticAssets` 未配或 main.ts 没启 | 查 main.ts:20 |
| 头像显示 `[object Object]` | useUpload.ts 没解 `data.url` | 已修（commit 28905d2） |
| 微信小程序二维码空白 | qrcode.ts 用了 legacy canvasId | 已修（commit 28905d2） |
