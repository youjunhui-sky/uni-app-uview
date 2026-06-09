# uni_backend_uview 后端迁移计划

> 项目路径：D:\git\uni\uni_backend_uview
> 创建时间：2026/06/07
> 目标：用 NestJS 重构后端 API，支持 uni_frontend
> 状态：📋 规划中

---

## 一、目标

将 `uni-backend` (Cool-Admin/Midway.js) 的部分 API 迁移到 `uni_backend_uview` (NestJS)，专门服务于 `uni_frontend` 移动端。

### 不迁移的内容
- 管理端 API (/admin/**)
- Cool-Admin 后台管理功能
- 非 uni_frontend 需要的接口

### 需要迁移的内容
- 移动端 API (/app/**) 中 uni_frontend 需要的接口
- 约 35 个接口

---

## 二、技术选型

| 项目 | 技术 | 说明 |
|------|------|------|
| 框架 | NestJS | 企业级 Node.js 框架 |
| ORM | TypeORM | 与现有实体兼容 |
| 数据库 | PostgreSQL | 复用现有数据库 |
| 认证 | JWT | 与现有逻辑一致 |
| 验证 | class-validator | DTO 验证 |
| 语言 | TypeScript | 类型安全 |

---

## 三、API 清单

### 3.1 用户服务 `service.user.*`

#### 登录 `POST /app/user/login/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| phone | POST `/app/user/login/phone` | 手机号+验证码登录 |
| smsCode | POST `/app/user/login/smsCode` | 发送短信验证码 |
| captcha | POST `/app/user/login/captcha` | 获取图片验证码 |
| refreshToken | POST `/app/user/login/refreshToken` | 刷新 Token |

#### 用户信息 `GET/POST /app/user/info/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| person | GET `/app/user/info/person` | 获取当前用户信息 |
| updatePerson | POST `/app/user/info/updatePerson` | 更新用户信息 |

#### 公共 `GET /app/user/comm/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| wxMpConfig | GET `/app/user/comm/wxMpConfig` | 微信配置 |

---

### 3.2 患者服务 `service.patient.*`

#### 就诊人 `POST /app/patient/patientUser/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| getByUserId | POST `/app/patient/patientUser/getByUserId` | 获取用户就诊人列表 |
| getCurrentPatient | POST `/app/patient/patientUser/getCurrentPatient` | 获取当前就诊人 |
| getByUserIdAndPatientNo | POST `/app/patient/patientUser/getByUserIdAndPatientNo` | 按用户ID和档案号查询 |
| addPatientUser | POST `/app/patient/patientUser/addPatientUser` | 添加就诊人 |
| updateDefault | POST `/app/patient/patientUser/updateDefault` | 设置默认就诊人 |
| delete | POST `/app/patient/patientUser/delete` | 删除就诊人 |

#### 患者信息 `POST/GET /app/patient/patientInfo/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| update | POST `/app/patient/patientInfo/update` | 更新患者信息 |
| getByIdCardAndName | POST `/app/patient/patientInfo/getByIdCardAndName` | 按证件号姓名查询 |

#### 患者列表 `POST/GET /app/patient/info/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| page | POST `/app/patient/info/page` | 分页查询患者 |
| info | GET `/app/patient/info/info` | 获取患者详情 |

#### 问卷 `POST /app/patient/questionnaire/*`

| 接口 | 路径 | 说明 |
|------|------|------|
| getQuestionnaireAnswerByPatientNoAndQuestionnaireId | POST `/app/patient/questionnaire/get...` | 获取已填问卷 |
| submitQuestionnaireAnswer | POST `/app/patient/questionnaire/submit` | 提交问卷答案 |

---

### 3.3 问卷服务 `service.questionnaire.*`

| 接口 | 路径 | 说明 |
|------|------|------|
| questionsWithOptions | POST `/app/questionnaire/questionnaire/questionsWithOptions` | 获取问卷题目 |

---

### 3.4 代谢评估 `service.etiology.*`

| 接口 | 路径 | 说明 |
|------|------|------|
| getMuaInfoByPatientNo | POST `/app/etiology/muaInfo/getMuaInfoByPatientNo` | 获取代谢评估列表 |
| getMuaContentByPatientNoAndSwlNo | POST `/app/etiology/muaInfo/getMuaContent...` | 获取评估详情 |

---

### 3.5 字典服务 `service.dict.*`

| 接口 | 路径 | 说明 |
|------|------|------|
| types | POST `/app/dict/info/types` | 获取字典类型列表 |
| data | POST `/app/dict/info/data` | 批量获取字典数据 |

---

### 3.6 公共服务 `service.base.comm`

| 接口 | 路径 | 说明 |
|------|------|------|
| uploadMode | GET `/app/base/comm/uploadMode` | 获取上传模式配置 |
| upload | POST `/app/base/comm/upload` | 文件上传 |
| param | GET `/app/base/comm/param` | 获取协议/文档内容 |
| eps | GET `/app/base/comm/eps` | 获取 EPS 服务定义 |

---

## 四、项目结构

```
uni_backend_uview/
├── src/
│   ├── main.ts                      # 入口
│   ├── app.module.ts                # 根模块
│   ├── common/                      # 公共模块
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts   # 统一响应格式
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts        # JWT 认证
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts  # 全局异常
│   │   └── dto/
│   │       └── page.dto.ts               # 分页 DTO
│   ├── config/
│   │   └── configuration.ts         # 环境配置
│   ├── modules/
│   │   ├── auth/                   # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   ├── user/                   # 用户模块
│   │   ├── patient/               # 患者模块
│   │   ├── questionnaire/          # 问卷模块
│   │   ├── etiology/              # 代谢评估模块
│   │   ├── dict/                  # 字典模块
│   │   └── upload/                # 文件上传模块
│   ├── entities/                  # TypeORM 实体
│   └── database/
│       └── database.module.ts      # 数据库配置
├── test/
├── package.json
├── tsconfig.json
├── nest-cli.json
└── MIGRATION_PLAN.md
```

---

## 五、响应格式

### 成功响应
```json
{
  "code": 1000,
  "data": { ... },
  "message": "success"
}
```

### 分页响应
```json
{
  "code": 1000,
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "size": 10,
      "total": 100
    }
  },
  "message": "success"
}
```

### 错误响应
```json
{
  "code": 1001,
  "data": null,
  "message": "错误描述"
}
```

---

## 六、执行计划

### 阶段一：项目初始化
- [ ] 1.1 初始化 NestJS 项目
- [ ] 1.2 安装依赖 (typeorm, pg, jwt, class-validator 等)
- [ ] 1.3 配置数据库连接
- [ ] 1.4 创建统一响应拦截器
- [ ] 1.5 创建 JWT 认证 Guard
- [ ] 1.6 配置跨域

### 阶段二：认证模块
- [ ] 2.1 创建 auth.controller.ts
- [ ] 2.2 创建 auth.service.ts
- [ ] 2.3 实现 phone 登录
- [ ] 2.4 实现 smsCode 发送短信
- [ ] 2.5 实现 captcha 图形验证码
- [ ] 2.6 实现 refreshToken

### 阶段三：用户模块
- [ ] 3.1 创建 user.controller.ts
- [ ] 3.2 实现 person 获取用户信息
- [ ] 3.3 实现 updatePerson 更新用户信息
- [ ] 3.4 实现 wxMpConfig 微信配置

### 阶段四：患者模块
- [ ] 4.1 创建 patientUser.controller.ts
- [ ] 4.2 创建 patientInfo.controller.ts
- [ ] 4.3 实现 getByUserId
- [ ] 4.4 实现 addPatientUser
- [ ] 4.5 实现 updateDefault
- [ ] 4.6 实现 update
- [ ] 4.7 实现 page 分页查询

### 阶段五：问卷+代谢评估
- [ ] 5.1 创建 questionnaire.controller.ts
- [ ] 5.2 实现 questionsWithOptions
- [ ] 5.3 创建 patientQuestionnaire.controller.ts
- [ ] 5.4 实现 submitQuestionnaireAnswer
- [ ] 5.5 创建 etiology.controller.ts
- [ ] 5.6 实现 getMuaInfoByPatientNo
- [ ] 5.7 实现 getMuaContentByPatientNoAndSwlNo

### 阶段六：字典+公共接口
- [ ] 6.1 创建 dict.controller.ts
- [ ] 6.2 实现 types
- [ ] 6.3 实现 data
- [ ] 6.4 创建 base.controller.ts
- [ ] 6.5 实现 upload
- [ ] 6.6 实现 param
- [ ] 6.7 实现 eps (EPS 服务定义)

### 阶段七：联调测试
- [ ] 7.1 配置前端 proxy
- [ ] 7.2 逐接口联调
- [ ] 7.3 修复问题

---

## 七、实体清单

从 `uni-backend` 迁移以下实体：

| 实体 | 用途 |
|------|------|
| UserEntity | 用户 |
| PatientUserEntity | 就诊人关联 |
| PatientEntity | 患者信息 |
| QuestionnaireEntity | 问卷 |
| QuestionnaireOptionEntity | 问卷选项 |
| QuestionnaireAnswerEntity | 问卷答案 |
| MuaInfoEntity | 代谢评估 |
| DictTypeEntity | 字典类型 |
| DictDataEntity | 字典数据 |

---

## 八、注意事项

### 8.1 路由前缀
保持与原 Cool-Admin 一致的路由：
- 移动端：`/app/*`
- 公共：`/open/*`

### 8.2 认证方式
- JWT Token 认证
- Token 在 Authorization header 中传递
- 格式：`Bearer {token}`

### 8.3 数据库
- 复用 `uni-backend` 的 PostgreSQL 数据库
- Entity 字段保持完全一致

### 8.4 文件上传
- 使用本地存储或七牛云
- 配置 uploadMode 接口返回上传方式

---

## 九、相关资源

- NestJS 文档：https://docs.nestjs.com/
- TypeORM 文档：https://typeorm.io/
- 现有数据库：uni-backend/src/modules/*/entity/

---

## 十、变更记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026/06/07 | v0.1 | 初始化文档 |
