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
| 2026/06/12 | v0.2 | 数据库切换至 mdp 库（多 schema 布局），详见 [十一、mdp 库迁移](#十一mdp-库迁移) |

---

## 十一、mdp 库迁移

> 目标库：`mdp`（同 PG 实例 `36.111.159.23:5432`，账号 `postgres/1223`）
> 执行日期：2026/06/12
> 详细列级 diff：[mdp-diff.md](./mdp-diff.md)
> introspect 脚本：[scripts/dump-mdp-ddl.js](./scripts/dump-mdp-ddl.js)；原始输出：[mdp-ddl.txt](./mdp-ddl.txt)

### 11.1 决策

| 决策点 | 决定 |
|---|---|
| user_info 新表名 | `tuser_info`（mdp 当前不存在，需先建表） |
| 实体字段命名 | 保留 camelCase，用 `@Column({ name: 'patient_no' })` 映射到 snake_case 列 |
| `base.ts` | 删除（11 个实体自包含主键 + 审计字段） |
| `synchronize` | 保持 `false` |
| SWL schema | 本轮不动 |
| 跨 schema JOIN | 无需特殊处理，所有跨表 JOIN 都在 `base` 内部 |
| API 兼容性 | 代谢评估的 `swlNo` 入参/出参 alias 保留，前端零改动；列引用内部改为 `mua_no` |

### 11.2 schema 映射（11 张表）

**`base` schema（9 张表）**：

| 实体 | 表名 | PK 类型 |
|---|---|---|
| `UserInfoEntity` | `tuser_info` | serial int |
| `PatientUserEntity` | `tpatient_user` | serial int |
| `PatientInfoEntity` | `tbus_patient_info` | **uuid** |
| `QuestionnaireEntity` | `tsys_questionnaire` | serial int |
| `QuestionEntity` | `tsys_question` | serial int |
| `OptionEntity` | `tsys_option` | serial int |
| `BaseSysParamEntity` | `tsys_param` | **bigint** |
| `DictTypeEntity` | `tsys_dict_type` | **bigint** |
| `DictInfoEntity` | `tsys_dict_info` | **bigint** |

**`mua` schema（2 张表）**：

| 实体 | 表名 | PK 类型 |
|---|---|---|
| `MuaInfoEntity` | `tetiology_mua_info` | serial int |
| `MuaContentEntity` | `tetiology_mua_content` | serial int |

### 11.3 共性改动

所有 11 个实体都做了：
1. 去掉 `extends BaseEntity`，删除 `base.ts` 文件
2. 自包含 `id`（按表决定 PK 类型）/`createdAt`（→ `created_at`）/`updatedAt`（→ `updated_at`）
3. `@Entity({ name, schema, comment })` 加 `schema: 'base' | 'mua'`
4. 新增 `orgId` 字段（uuid，可空；`tsys_option` 表除外）
5. 所有 `@Column` 的 `name` 改成 snake_case

### 11.4 表级重要差异

| 表 | 关键差异 |
|---|---|
| `base.tuser_info` | mdp 中不存在，需手工建表（DDL 见下） |
| `base.tpatient_user` | mdp 中不存在，需手工建表（DDL 见下） |
| `base.tbus_patient_info` | **PK 改为 uuid**；新增 `zipCode`/`idType` |
| `base.tsys_questionnaire` | `creator_id` 改可空；新增 `org_id` |
| `base.tsys_option` | `score` 改可空；mdp 此表无 `org_id`，实体不增 |
| `base.tsys_param` | **PK 改为 bigint**；`data_type` 默认值 1 → 0 |
| `base.tsys_dict_type` | **PK 改为 bigint**；新增 `status`/`module`/`org_id` |
| `base.tsys_dict_info` | **PK 改为 bigint**；`type_id` int → bigint；`parent_id` int → **varchar(100)**（业务侧需要把数字当字符串用） |
| `mua.tetiology_mua_info` | `swl_no` → `mua_no`；新增 `gender`/`anatomy_abnormality`/`org_id` |
| `mua.tetiology_mua_content` | `swl_no` → `mua_no`；新增 `org_id` |

### 11.5 Service 改动

- [dict.service.ts:45](./src/modules/dict/dict.service.ts#L45) `addOrderBy('a.createTime')` → `addOrderBy('a.created_at')`
- [patient.service.ts:121-122, 132-133](./src/modules/patient/patient.service.ts#L121) 对象字面量的 `createTime`/`updateTime` → `createdAt`/`updatedAt`
- [patient.service.ts:230](./src/modules/patient/patient.service.ts#L230) `findOneBy({ id: parseInt(id) })` → `findOneBy({ id })`（因 PK 改 uuid）
- [etiology.service.ts:25, 77, 90](./src/modules/etiology/etiology.service.ts#L25) `'a."swlNo"'` → `'a.mua_no'`（列引用新名，alias 保留 `swlNo` 不破坏 API）

### 11.6 切库前需要在 mdp 库执行的 DDL

```sql
-- 1. schema
CREATE SCHEMA IF NOT EXISTS base;
CREATE SCHEMA IF NOT EXISTS mua;

-- 2. tuser_info（mdp 中没有，按现 user-info.entity.ts 结构建）
CREATE TABLE IF NOT EXISTS base.tuser_info (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id        UUID,
  unionid       VARCHAR,
  "avatarUrl"   VARCHAR,
  "nickName"    VARCHAR,
  phone         VARCHAR,
  gender        SMALLINT NOT NULL DEFAULT 0,
  status        SMALLINT NOT NULL DEFAULT 1,
  "loginType"   SMALLINT NOT NULL DEFAULT 0,
  password      VARCHAR,
  description   TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS tuser_info_unionid_unique ON base.tuser_info(unionid);
CREATE UNIQUE INDEX IF NOT EXISTS tuser_info_phone_unique    ON base.tuser_info(phone);

-- 3. tpatient_user（mdp 中没有）
CREATE TABLE IF NOT EXISTS base.tpatient_user (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id       UUID,
  "patientNo"  VARCHAR(20) NOT NULL,
  "userId"     INT NOT NULL,
  "default"    INT NOT NULL DEFAULT 0,
  "tenantId"   INT
);
```

### 11.7 切库步骤

1. **停服**（或切到只读模式）
2. **mdp 库执行 11.6 的 DDL**（建 schema + 建 tuser_info + 建 tpatient_user）
3. **修改 `database.config.ts` 的 `database` 默认值**：`'herisdb'` → `'mdp'`（或通过 `DB_NAME=mdp` 环境变量注入）
4. **启动后端**：`npm run start:dev`，观察启动日志确认连接到 `mdp`
5. **冒烟测试**：
   - auth：图形验证码 → 手机号+验证码登录 → 拿 token
   - patient：列就诊人、新建就诊人、设为默认、拉详情（验 uuid id）
   - questionnaire：拉问卷列表、拉问卷详情
   - etiology：按 `patientNo` 拉代谢评估（验 mua 跨 schema 查询）；按 `swlNo` 拉详情（验列引用改 mua_no）
   - dict：拿字典类型、拿字典数据（验 bigint id 和 varchar parent_id）
   - base：拿协议参数、上传文件
6. **观察 1~2 天后**，herisdb 改只读或下线

### 11.8 风险

| 风险 | 触发条件 | 缓解 |
|---|---|---|
| `DictInfoEntity.parentId` 类型变更（int → varchar） | 业务代码把 parentId 当数字用 | 上线前 grep 所有引用方，改为字符串处理 |
| `BaseSysParamEntity.id` 改 bigint | 前端按 int 解析会精度丢失（>2^31） | 确认前端解析方式（JSON.parse 默认是 number，超 16 位会丢精度） |
| 业务侧期望 PK 是 number，但 tbus_patient_info 改 uuid | 任何传 `parseInt(patientId)` 的代码 | grep 整个仓库，替换为字符串处理 |
| 上线时切库瞬间连接断 | 用户态事务 | 选低峰期切换；切换期间 herisdb 改只读兜底 |
| mdp 缺少 tuser_info / tpatient_user | 没跑 11.6 的 DDL | 切库前必跑，启后端后第一次登录验证 |

### 11.9 回滚方案

1. 把 `database.config.ts` 的 `database` 改回 `'herisdb'`
2. 重启后端
3. 业务继续走 herisdb（migrate 出去的代码因为 entity 改了，所以**回滚到 herisdb 后会有列名不匹配**，需要同时回滚代码）

**建议**：回滚前先 `git revert` 当前 mdp 迁移的 commit，再切回 herisdb。

