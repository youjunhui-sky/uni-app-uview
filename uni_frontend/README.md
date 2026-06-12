# 泌尿系结石诊疗系统 · 前端

基于 **uni-app + Vue 3 + uView Plus** 的多端应用,支持 H5 / 微信小程序 / App。

> 项目最初由 [cool-uni](https://uni-docs.cool-js.com/) 脚手架生成,后已**完整迁移**至 uView Plus,详见 [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)。

---

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | uni-app(`@dcloudio/uni-app` 3.x) + Vue 3.5 |
| UI 组件库 | [uView Plus](https://uiadmin.net/uview-plus/) (`up-*` 前缀) |
| 状态管理 | Pinia 2.x |
| 国际化 | vue-i18n 9.x |
| 构建工具 | Vite 5 |
| 语言 | TypeScript 5 |
| 后端通信 | 自封装 `useService` + `useRequest`(含 token 刷新) |

---

## 目录结构

```
uni_frontend/
├── components/        # 业务通用组件(page-wrapper、otp-input、date-picker 等)
├── composables/       # 组合式函数(替代原 cool/ 框架核心)
│   ├── useRouter.ts   # 路由跳转、导航守卫
│   ├── useService.ts  # API 服务调用
│   ├── useStorage.ts  # 本地存储
│   ├── useUpload.ts   # 文件上传
│   ├── usePager.ts    # 分页器
│   ├── useUi.ts       # UI 提示封装(toast/loading)
│   └── useWx.ts       # 微信相关
├── stores/            # Pinia 状态(user、dict)
├── pages/             # 页面(主包 index + 分包 patient/report/questionnaire/user)
├── router/            # 路由配置
├── hooks/             # 业务 hooks
├── config/            # 运行时配置(dev/prod/proxy)
├── locale/            # i18n 语言包
├── utils/             # 工具函数(logger、comm 等)
├── static/            # 静态资源
├── types/             # TS 类型声明
├── manifest.json      # uni-app 多端清单
├── pages.json         # 路由与分包
├── vite.config.ts     # Vite 配置(代理、SCSS 注入)
└── uni.scss           # 全局 SCSS 变量
```

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动 H5 开发(默认 9900 端口)
npm run dev:h5

# 启动微信小程序开发
npm run dev:mp-weixin

# 构建 H5
npm run build:h5

# 一键部署(参考 deploy.sh / DEPLOY.md)
npm run deploy
```

> 后端服务运行在 `127.0.0.1:8002`,由 [vite.config.ts](./vite.config.ts) 的 proxy `/dev → 8002` 代理。
> 详细启动流程参见根目录 `.claude/skills/dev-stack-orchestrator/`。

---

## 组件使用约定

**强制规范**(根目录 [CLAUDE.md](../CLAUDE.md) 已记录):

- `up-text` 必须用 `text` 属性,**禁止**插槽内容
- `up-popup` 用 `:show` 而非 `v-show`
- `up-icon` 用 `name` 属性指定图标
- `up-tabs` 用 `v-model:current`(具名 v-model),`v-model` 绑定的是数字索引
- `up-card` 内容放 `#body` 插槽

示例:

```vue
<template>
  <up-text text="标题" size="large" />
  <up-popup :show="visible" mode="bottom" @close="visible = false">
    <up-icon name="close" :size="32" />
  </up-popup>
  <up-tabs v-model:current="activeTab" :list="tabList" keyName="label" />
</template>
```

---

## 调用示例

```ts
import { useService } from "@/composables/useService";
import { useUi } from "@/composables/useUi";
import { useStorage } from "@/composables/useStorage";

const service = useService();
const ui = useUi();
const storage = useStorage();

// 调用后端接口
const list = await service.patient.list({ page: 1 });

// UI 提示
ui.showToast("操作成功");

// 本地存储
storage.set("token", "xxx");
```

---

## 相关文档

- [DEPLOY.md](./DEPLOY.md) —— 部署与 nginx 缓存策略
- [MIGRATION_PLAN.md](./MIGRATION_PLAN.md) —— cool-ui → uView Plus 迁移记录
- [../OPTIMIZATION.md](../OPTIMIZATION.md) —— 优化待办
- [../CLAUDE.md](../CLAUDE.md) —— 项目级开发约定
