# cool-ui → uView Plus 迁移计划

> 项目：D:\git\uni
> 创建时间：2026/06/06
> 最后更新：2026/06/08
> 目标：用 uView Plus 完整替换 cool-ui 框架
> 状态：✅ 迁移完成

---

## 迁移进度

| 阶段 | 状态 | 完成项 |
|------|------|--------|
| 阶段1：基础设施准备 | ✅ 已完成 | 安装uView Plus、更新vite.config.ts/main.ts/App.vue/uni.scss、创建useUi适配层 |
| 阶段2：创建封装组件 | ✅ 已完成 | page-wrapper.vue、otp-input.vue、date-picker.vue、single-select.vue |
| 阶段3：页面替换 | ✅ 已完成 | 22个页面/组件全部替换完成 |
| 阶段4：清理cool-ui代码 | ✅ 已完成 | 删除cool-ui、demo目录、cool-vue/vite-plugin、cool/目录 |
| 阶段5：测试验证 | 🔄 进行中 | 待运行验证 |

### 已完成替换的页面/组件（22个）
- ✅ pages/user/about.vue
- ✅ pages/user/captcha.vue
- ✅ pages/user/edit.vue
- ✅ pages/user/set.vue
- ✅ pages/user/login.vue
- ✅ pages/index/components/tabbar.vue
- ✅ components/agree-btn.vue
- ✅ components/sms-btn.vue
- ✅ pages/patient/mgnPatientNew.vue
- ✅ pages/patient/mgnPatient.vue
- ✅ pages/patient/updatePatient.vue
- ✅ pages/patient/addPatientNew.vue
- ✅ pages/patient/addPatient.vue
- ✅ pages/patient/info/index.vue
- ✅ pages/patient/list/index.vue
- ✅ pages/index/home.vue
- ✅ pages/index/my.vue
- ✅ pages/report/index.vue
- ✅ pages/report/etiology-report-detail.vue
- ✅ pages/report/components/etiology-report.vue
- ✅ pages/report/components/swl-report.vue
- ✅ pages/questionnaire/index.vue

### 已清理内容
- ✅ 删除 uni_modules/cool-ui/
- ✅ 删除 pages/demo/（53个页面）
- ✅ 删除 build/cool/
- ✅ 移除 @cool-vue/vite-plugin
- ✅ 更新 vite.config.ts / main.ts / App.vue / uni.scss
- ✅ 清理 static/css/index.scss 中的 cool-ui 样式
- ✅ 更新 router/index.ts 和 cool/hooks/pager.ts 中的 useUi 引用
- ✅ 删除 cool/ 目录（框架核心已迁移到 composables/）
- ✅ 清理业务代码中的 cool 引用

---

## 新架构

```
uni-app + Vue 3 + Pinia + uView Plus（up-前缀）
├── uView Plus 替换 cool-ui
├── composables/ 标准组合式函数
│   ├── useRouter.ts # 路由管理
│   ├── useService.ts   # API服务（静态定义）
│   ├── useStorage.ts   # 本地存储
│   ├── useRequest.ts   # HTTP请求封装
│   ├── useUpload.ts    # 文件上传
│   ├── usePager.ts     # 分页器
│   ├── useRefs.ts      # 模板引用
│   ├── useUi.ts        # UI提示封装
│   └── useWx.ts        # 微信相关
├── stores/             # Pinia状态管理
│   ├── user.ts # 用户状态
│   └── dict.ts         # 字典状态
├── utils/              # 工具函数
│   └── comm.ts         # 通用工具
└── 移除 @cool-vue/vite-plugin
```

---

## composables 模块说明

| 文件 | 说明 | 替代原 cool 模块 |
|------|------|-----------------|
| `useRouter.ts` | 路由跳转、导航守卫 | `cool/router` |
| `useService.ts` | API服务调用（静态EPS定义） | `cool/service` |
| `useStorage.ts` | 本地存储封装 | `cool/utils/storage` |
| `useRequest.ts` | HTTP请求封装（含token刷新） | `cool/service/request` |
| `useUpload.ts` | 文件上传 | `cool/upload` |
| `usePager.ts` | 分页器 | `cool/hooks/pager` |
| `useRefs.ts` | 模板引用 | `cool/hooks/comm` |
| `useUi.ts` | UI提示封装 | `cool-ui useUi()` |
| `useWx.ts` | 微信相关功能 | `cool/hooks/wx` |

---

## stores 模块说明

| 文件 | 说明 | 替代原 cool 模块 |
|------|------|-----------------|
| `stores/user.ts` | 用户状态、Token管理 | `cool/store/user` |
| `stores/dict.ts` | 字典数据管理 | `cool/store/dict` |

---

## 三、替换对照表（cool-ui → uView Plus）

| cool-ui 组件 | uView Plus 组件 | 说明 |
|-------------|----------------|------|
| `cl-page` | 需新建 `page-wrapper.vue` | uView Plus 无 page 封装 |
| `cl-button` | `up-button` | props 基本一致 |
| `cl-text` | `up-text` | size 从数字→枚举 |
| `cl-card` | `up-card` | header 结构不同 |
| `cl-input` | `up-input` | rpx 需转 px（÷2） |
| `cl-textarea` | `up-textarea` | 同上 |
| `cl-select` | 需新建 `single-select.vue` | popup + picker 组合 |
| `cl-select-date` | 需新建 `date-picker.vue` | popup + picker 组合 |
| `cl-select-popup` | `up-popup` | 基本一致 |
| `cl-select-city` | 需扩展 date-picker | 同上 |
| `cl-select-region` | 需扩展 date-picker | 同上 |
| `cl-form` / `cl-form-item` | 可简化为 `up-input` | 本项目表单简单 |
| `cl-captcha` | 需新建 `otp-input.vue` | 无等效组件 |
| `cl-icon` | `up-icon` | Iconify 图标库 |
| `cl-popup` | `up-popup` | 基本一致 |
| `cl-list` | `up-cell-group` | 基本一致 |
| `cl-list-item` | `up-cell` | 基本一致 |
| `cl-avatar` | `up-avatar` | shape 替代 round |
| `cl-tag` | `up-tag` | 基本一致 |
| `cl-switch` | `up-switch` | 基本一致 |
| `cl-radio` / `cl-radio-group` | `up-radio` / `up-radio-group` | 基本一致 |
| `cl-checkbox` / `cl-checkbox-group` | `up-checkbox` / `up-checkbox-group` | 基本一致 |
| `cl-tabs` | `up-tabs` | 基本一致 |
| `cl-loadmore` | `up-loadmore` | status 替代 loading |
| `cl-search` | `up-search` | 基本一致 |
| `cl-grid` / `cl-grid-item` | `up-grid` / `up-grid-item` | 基本一致 |
| `cl-col` / `cl-row` | `up-col` / `up-row` | 基本一致 |
| `cl-sticky` | `up-sticky` | 基本一致 |
| `cl-topbar` | `up-navbar` | 基本一致 |
| `cl-status-bar` | `up-status-bar` | 基本一致 |
| `cl-footer` | CSS 手动实现 | 无等效组件 |
| `cl-divider` | `up-divider` | 基本一致 |
| `cl-loading` / `cl-loading-mask` | `up-loading` / `up-loading-page` | 基本一致 |
| `cl-action-sheet` | `up-action-sheet` | 基本一致 |
| `cl-confirm` / `cl-dialog` | `up-modal` | 基本一致 |
| `cl-toast` | `up-toast` + `useToast()` | 通过适配层调用 |
| `cl-banner` | 原生 `<swiper>` | 复杂，需手动实现 |
| `cl-waterfall` / `cl-waterfall-column` | `up-waterfall` | API 略有不同 |
| `cl-skeleton` | `up-skeleton` / `up-skeleton-item` | 基本一致 |
| `cl-rate` | `up-rate` | 基本一致 |
| `cl-input-number` | `up-number-box` | 基本一致 |
| `cl-progress` | `up-line-progress` / `up-circle-progress` | 基本一致 |
| `cl-upload` | `up-upload` | 基本一致 |
| `cl-countdown` | `up-countdown` | 时间单位不同（秒→毫秒） |
| `cl-avatar-group` | `up-avatar-group` | 基本一致 |

---

## 四、新建的封装组件

| 组件 | 文件路径 | 说明 |
|------|---------|------|
| 页面容器 | `components/page-wrapper.vue` | 替代 cl-page（状态栏+安全区+全局弹窗） |
| 短信验证码输入 | `components/otp-input.vue` | 替代 cl-captcha（4位OTP输入框） |
| 日期选择器 | `components/date-picker.vue` | 替代 cl-select-date（popup+picker封装） |
| 单项选择器 | `components/single-select.vue` | 替代 cl-select（popup+picker封装） |
| UI适配层 | `composables/useUi.ts` | 适配 useUi() 调用（showToast/showConfirm等） |

---

## 五、API 服务静态化

### 服务基础信息

| 配置项 | 值 |
|--------|-----|
| 开发环境 baseUrl | `/dev` |
| 开发代理 | `http://127.0.0.1:8001` |
| 生产环境 baseUrl | `/api` |
| 成功响应码 | `code === 1000` |
| Token 刷新接口 | `service.user.login.refreshToken` |

### 一、用户服务 `service.user.*`

| 方法 | 路径 | 说明 |
|------|------|------|
| `phone(data)` | POST `/app/user/login/phone` | 手机号+验证码登录 |
| `smsCode(data)` | POST `/app/user/login/smsCode` | 发送短信验证码 |
| `captcha(data)` | POST `/app/user/login/captcha` | 获取图片验证码 |
| `refreshToken(data)` | POST `/app/user/login/refreshToken` | 刷新Token |
| `person()` | GET `/app/user/info/person` | 获取当前用户信息 |
| `updatePerson(data)` | POST `/app/user/info/updatePerson` | 更新用户信息 |
| `wxMpConfig(data)` | GET `/app/user/comm/wxMpConfig` | 微信配置 |

### 二、患者服务 `service.patient.*`

| 方法 | 路径 | 说明 |
|------|------|------|
| `getByUserId(data)` | POST `/app/patient/patientUser/getByUserId` | 获取用户就诊人列表 |
| `getCurrentPatient(data)` | POST `/app/patient/patientUser/getCurrentPatient` | 获取当前就诊人 |
| `addPatientUser(data)` | POST `/app/patient/patientUser/addPatientUser` | 添加就诊人 |
| `updateDefault(data)` | POST `/app/patient/patientUser/updateDefault` | 设置默认就诊人 |
| `delete(data)` | POST `/app/patient/patientUser/delete` | 删除就诊人 |
| `update(data)` | POST `/app/patient/patientInfo/update` | 更新患者信息 |
| `page(data)` | POST `/app/patient/info/page` | 分页查询患者 |
| `info(params)` | GET `/app/patient/info/info` | 获取患者详情 |

### 三、问卷服务 `service.questionnaire.*`

| 方法 | 路径 | 说明 |
|------|------|------|
| `questionsWithOptions()` | POST `/app/questionnaire/questionnaire/questionsWithOptions` | 获取问卷题目 |

### 四、代谢评估 `service.etiology.*`

| 方法 | 路径 | 说明 |
|------|------|------|
| `getMuaInfoByPatientNo(data)` | POST `/app/etiology/muaInfo/getMuaInfoByPatientNo` | 获取代谢评估列表 |
| `getMuaContentByPatientNoAndSwlNo(data)` | POST `/app/etiology/muaInfo/getMuaContent...` | 获取评估详情 |

### 五、字典服务 `service.dict.*`

| 方法 | 路径 | 说明 |
|------|------|------|
| `data(data)` | POST `/app/dict/info/data` | 批量获取字典数据 |

### 六、公共服务 `service.base.comm`

| 方法 | 路径 | 说明 |
|------|------|------|
| `uploadMode()` | GET `/app/base/comm/uploadMode` | 获取上传模式配置 |
| `upload(data)` | POST `/app/base/comm/upload` | 文件上传 |
| `param(params)` | GET `/app/base/comm/param` | 获取协议/文档内容 |

---

## 六、验证清单

迁移完成后检查以下内容：

- [ ] 所有 cl-* 组件已替换为 up-* 或自定义封装
- [ ] useUi() 调用正常工作
- [ ] 页面样式与原来一致
- [ ] H5 和小程序均可正常打开
- [ ] 无 console.error
- [ ] 表单提交、列表加载、弹窗等功能正常
- [ ] 主题色 #6b69f8 保持一致
- [ ] 用户登录流程正常
- [ ] 就诊人相关功能正常
- [ ] 问卷提交功能正常
- [ ] 报告查看功能正常

---

## 七、相关资源

- uView Plus 文档：https://uview-plus.com/
- uView Plus GitHub：https://github.com/umicro/uViewPlus
- 安装命令：`npm i uview-plus`