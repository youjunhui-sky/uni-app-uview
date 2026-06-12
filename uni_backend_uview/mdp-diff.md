# mdp 库迁移：实施计划 + DDL 差异 + 范围清单

> 跟踪文件。所有改动按"执行一个确认一个"节奏推进，新发现的问题追加到本文末"九、待办/新发现"。

---

## 〇、决策记录

| 决策点 | 决定 |
|---|---|
| 目标库 | `mdp`（同 PG 实例 `36.111.159.23:5432`，账号 `postgres/1223`） |
| user_info 新表名 | `tuser_info`（mdp 当前不存在，需用户先建表） |
| 实体字段命名 | 保留 camelCase，用 `@Column({ name: 'patient_no' })` 映射到 snake_case 列 |
| `base.ts` | 删除 |
| `synchronize` | 保持 `false` |
| SWL 表 | 本轮不动 |

---

## 一、introspect 结论

直连 `mdp` 拉了 11 张表的真实 DDL。脚本：[scripts/dump-mdp-ddl.js](scripts/dump-mdp-ddl.js)；原始输出：[mdp-ddl.txt](mdp-ddl.txt)。

**关键事实**：
- 所有表都是 snake_case 列名 + `created_at`/`updated_at` 审计 + 大多有 `org_id uuid NULL`
- 主键类型不统一：serial int / bigint / uuid
- `tuser_info` 和 `tpatient_user` 在 mdp 中**不存在**，需要补建

---

## 二、共性改动（11 个实体都做）

1. 删除 `import { BaseEntity } from '../base/entity/base';`
2. 删除 `extends BaseEntity`
3. 在每个 entity 内自包含三个字段：
   ```ts
   @PrimaryGeneratedColumn() id: number;        // 多数表
   // 或 @PrimaryGeneratedColumn('uuid') id: string;  // tbus_patient_info
   @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
   @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
   ```
4. `@Entity({ name, schema, comment })` 加 `schema: 'base' | 'mua'`
5. 新增 `orgId: string | null` 字段（option 实体除外，见下表）：
   ```ts
   @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
   ```
6. 所有 `@Column` 的 `name` 改成 snake_case

---

## 三、11 个实体的个性改动

| # | 实体文件 | schema | 改 name | PK 类型 | 业务字段变动 | 新增字段 | 类型/可空变更 |
|---|---|---|---|---|---|---|---|
| 1 | [user-info.entity.ts](../uni_backend_uview/src/entities/user-info.entity.ts) | base | `user_info` → `tuser_info` | int | — | orgId | — |
| 2 | [patient-user.entity.ts](../uni_backend_uview/src/entities/patient-user.entity.ts) | base | （不变） | int | — | orgId | — |
| 3 | [patient-info.entity.ts](../uni_backend_uview/src/entities/patient-info.entity.ts) | base | （不变） | **uuid** | — | orgId, `zipCode` varchar(6), `idType` varchar(10) | — |
| 4 | [questionnaire.entity.ts](../uni_backend_uview/src/entities/questionnaire.entity.ts) | base | （不变） | int | — | orgId | `creatorId` int **改可空** |
| 5 | [question.entity.ts](../uni_backend_uview/src/entities/question.entity.ts) | base | （不变） | int | — | orgId | — |
| 6 | [option.entity.ts](../uni_backend_uview/src/entities/option.entity.ts) | base | （不变） | int | — | — | `score` int **改可空**；**不加 orgId**（mdp 此表无此列） |
| 7 | [sys-param.entity.ts](../uni_backend_uview/src/entities/sys-param.entity.ts) | base | `base_sys_param` → `tsys_param` | **bigint** | — | orgId | `dataType` 默认 1 → **0** |
| 8 | [dict-type.entity.ts](../uni_backend_uview/src/entities/dict-type.entity.ts) | base | `dict_type` → `tsys_dict_type` | **bigint** | — | orgId, `status` smallint default 1, `module` varchar(50) | — |
| 9 | [dict-info.entity.ts](../uni_backend_uview/src/entities/dict-info.entity.ts) | base | `dict_info` → `tsys_dict_info` | **bigint** | — | orgId, `status` smallint default 1 | `typeId` int → **bigint**；`parentId` int → **varchar(100)**；`name` 加 varchar(100) 长度；`value` 加 varchar(255) 长度；`remark` 加 varchar(500) 长度 |
| 10 | [mua-info.entity.ts](../uni_backend_uview/src/entities/mua-info.entity.ts) | mua | （不变） | int | `swlNo` → **`muaNo`**；`department` 长度 30 → 50 | orgId, `gender` int, `anatomyAbnormality` text | — |
| 11 | [mua-content.entity.ts](../uni_backend_uview/src/entities/mua-content.entity.ts) | mua | （不变） | int | `swlNo` → **`muaNo`** | orgId | — |

---

## 四、`base.ts` 处理

- **删除** [src/base/entity/base.ts](../uni_backend_uview/src/base/entity/base.ts)
- 各 entity 自带 `id` / `createdAt` / `updatedAt`

---

## 五、Service 改动（3 个文件）

| 文件 | 改动 |
|---|---|
| [dict.service.ts:45](../uni_backend_uview/src/modules/dict/dict.service.ts#L45) | `.addOrderBy('a.createTime', 'ASC')` → `.addOrderBy('a.created_at', 'ASC')` |
| [patient.service.ts:121-122, 132-133](../uni_backend_uview/src/modules/patient/patient.service.ts#L121) | 写入对象 `createTime`/`updateTime` → `createdAt`/`updatedAt` |
| [etiology.service.ts](../uni_backend_uview/src/modules/etiology/etiology.service.ts) | 全部 `swlNo` → `muaNo`（select 列表、where 条件、params 字段名） |

> grep 全量扫过 `src/modules/**`，除上述 3 处外，**没有其它** `createTime`/`updateTime`/`swlNo` 字面量引用。

---

## 六、配套 DDL（由用户在 mdp 库执行）

```sql
-- 1. schema
CREATE SCHEMA IF NOT EXISTS base;
CREATE SCHEMA IF NOT EXISTS mua;

-- 2. tuser_info（mdp 里没有）
CREATE TABLE IF NOT EXISTS base.tuser_info (
  id            SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id        UUID,
  unionid       VARCHAR,                       -- 索引 UNIQUE（与现 entity 一致）
  "avatarUrl"   VARCHAR,
  "nickName"    VARCHAR,
  phone         VARCHAR,                       -- 索引 UNIQUE
  gender        SMALLINT NOT NULL DEFAULT 0,
  status        SMALLINT NOT NULL DEFAULT 1,
  "loginType"   SMALLINT NOT NULL DEFAULT 0,
  password      VARCHAR,
  description   TEXT
);
-- 注：loginType/avatarUrl/nickName/description 这 4 个业务字段沿用现 entity 的 camelCase
-- 如需统一 snake_case 化（login_type/avatar_url/nick_name/...）请告诉我，我同步改 entity @Column

-- 3. tpatient_user（mdp 里没有）
CREATE TABLE IF NOT EXISTS base.tpatient_user (
  id           SERIAL PRIMARY KEY,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  org_id       UUID,
  patient_no   VARCHAR(20) NOT NULL,
  user_id      INT NOT NULL,
  "default"    INT NOT NULL DEFAULT 0
);
-- 注：业务字段统一 snake_case
```

---

## 七、范围外（不动）

- `database.config.ts`（已就位，默认 `mdp`）
- `app.module.ts`
- 所有 `*.module.ts`（forFeature 注册列表不动，除非表不存在）
- 所有 controller
- 前端 `uni_frontend/` 全部
- `synchronize` 配置
- `nest-cli.json` / `tsconfig.json` / `package.json`
- `MIGRATION_PLAN.md`（仅追加章节，不改现有内容）

---

## 八、执行节奏（一个一个改，每步停确认）

| 步 | 内容 | 状态 |
|---|---|---|
| 1 | (本文为计划) | ✅ |
| 2 | 删除 `src/base/entity/base.ts` | ✅ |
| 3 | 重写 `option.entity.ts`（最简单的，6 个字段） | ✅ |
| 4 | 重写 `question.entity.ts` | ✅ |
| 5 | 重写 `questionnaire.entity.ts` | ✅ |
| 6 | 重写 `patient-user.entity.ts` | ✅ |
| 7 | 重写 `user-info.entity.ts` | ✅ |
| 8 | 重写 `sys-param.entity.ts` | ✅ |
| 9 | 重写 `dict-type.entity.ts` | ✅ |
| 10 | 重写 `dict-info.entity.ts` | ✅ |
| 11 | 重写 `patient-info.entity.ts`（UUID 主键） | ✅ |
| 12 | 重写 `mua-info.entity.ts` | ✅ |
| 13 | 重写 `mua-content.entity.ts` | ✅ |
| 14 | 改 `dict.service.ts` | ✅ |
| 15 | 改 `patient.service.ts` | ✅ |
| 16 | 改 `etiology.service.ts` | ✅ |
| 17 | `npx tsc --noEmit` 验证 | ✅（修复 1 处 patient.service.ts:230 `parseInt`） |
| 18 | `npx nest build` 验证 | ✅ |
| 19 | 追加 `MIGRATION_PLAN.md` 章节 | ✅ |
| 20 | git commit（按节奏拆 1-3 个 commit） | ✅ 合并 1 个 commit：88699ad |

---

## 九、待办 / 新发现

> 后续新提出的改动会追加在这里，状态 ⬜ 待办 / 🟡 进行中 / ✅ 完成。

| # | 提出时间 | 内容 | 状态 |
|---|---|---|---|
| 1 | 2026/06/12 | `base.tpatient_user` 去掉 `tenantId` 字段（用户确认无租户隔离需求） | ✅（含 JOIN/select 同步清理） |
| 2 | 2026/06/12 | `mua.tetiology_mua_info` 去掉 `tenant_id` 字段；`etiology.service.ts` 同步清理 `tenantId` 过滤逻辑 | ✅ |
| 3 | 2026/06/12 | 冒烟测试发现：service 里的 `b."patientNo"` / `b."idCard"` / `a."patientNo"` 列引用还是 camelCase，实体列名已改 snake_case，SQL 报 `column does not exist`。需要批量改列引用 | ✅ |
| 4 | 2026/06/12 | `tpatient_user` 业务字段统一 snake_case：`patientNo`→`patient_no`、`userId`→`user_id`（`default` 保留，是 SQL 保留字） | ✅ |
