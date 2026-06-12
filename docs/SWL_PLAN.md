# SWL 诊疗功能 手机端实施规划

> 创建日期：2026-06-13
> 状态：**规划阶段**
> 入口：`pages/index/home.vue` → "查看报告" 卡片 → `pages/report/index.vue` → **SWL 诊疗** Tab

---

## 0. 关键决策（已确认）

| 决策项 | 选择 |
|---|---|
| 详情页架构 | **上下滚动九宫格**入口（不再用顶部 Tab 容器） |
| 婚育史显示 | **仅女性显示**（`gender === 2`） |
| 后端策略 | **从 PC 端移植 16 个 controller** 到手机端 NestJS |
| 结石成分模块 | **保留入口**，PC 端模块结构待后续单独检查 |

---

## 1. 整体架构

```
查看报告 (report/index)                    ← 已有，2 个 Tab
  └─ Tab: SWL 诊疗
       └─ swl-report.vue                   ← 列表页（诊疗记录卡片）
            └─ swl-detail.vue              ← 详情页（**九宫格入口**）
                 ├─ sqbl/info.vue          ← 术前病历（4 步向导 + 7 子项）
                 ├─ treatment/record.vue   ← 治疗记录（时间轴）
                 ├─ ultrasound.vue         ← 超声报告（图文混排）
                 ├─ followup.vue           ← 随访记录（3 子 Tab）
                 └─ composition.vue        ← 结石成分（图表 + 列表）
```

> **设计要点**：九宫格入口 + 独立页面深链，每个模块独立页面，可独立返回上一层。

---

## 2. 列表页 swl-report.vue

### 设计

```
┌──────────────────────────────────────┐
│  SWL 诊疗                            │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ 诊疗号：SWL202406001  ▶          │ │
│ │ ┌────────┐                      │ │
│ │ │ 已完成 │  <up-tag primary>    │ │
│ │ └────────┘                      │ │
│ │ ─────────────────────────       │ │
│ │ 姓名：张三    碎石号：001       │ │
│ │ 治疗时间：2024-06-01            │ │
│ │ 期数：第 1 期    序列号：A-003   │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 实现要点
- 卡片结构、tag、日期格式化直接照抄 `etiology-report.vue`
- `service.etiology.muaInfo.getMuaInfoByPatientNo` 替换为 `service.swl.register.getByPatientNo`

### 后端 API 约定
```
POST /app/swl/register/getByPatientNo
Body: { patientNo: string }
Returns: [{ id, swlNo, name, gender, age, treatmentDate, episode, sequenceNo, status }]
```

---

## 3. 详情页 swl-detail.vue（九宫格入口）

### 设计

```
┌──────────────────────────────────────┐
│  ← 返回   SWL 诊疗详情               │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐  │
│  │ 🧑 张三  男  45 岁             │  │  ← 患者信息卡
│  │ 碎石号：001   期数：1           │  │
│  │ 状态：●进行中                   │  │
│  └────────────────────────────────┘  │
│                                      │
│  诊疗模块                             │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │   📋   │ │   💊   │ │   🖼️   │   │  ← 3x2 九宫格
│  │ 术前病历│ │ 治疗记录│ │ 超声报告│   │
│  │ 已完成 │ │ 2 次   │ │ 1 张   │   │
│  └────────┘ └────────┘ └────────┘   │
│  ┌────────┐ ┌────────┐ ┌────────┐   │
│  │   📞   │ │   🧪   │ │         │   │
│  │ 随访记录│ │ 结石成分│ │  返回   │   │  ← 第 6 格"返回列表"
│  │ 3 次   │ │ 草酸钙 │ │  列表   │   │
│  └────────┘ └────────┘ └────────┘   │
└──────────────────────────────────────┘
```

### 实现要点
- 九宫格用 `display: grid; grid-template-columns: repeat(3, 1fr); gap: 20rpx`
- 每个模块卡片显示 **图标 + 标题 + 摘要数字**（如"2 次"）
- 摘要数字需后端返回或前端从各模块 API 聚合
- 未实现模块显示为灰色 + "未填写"
- 第 6 格"返回列表"按钮（点击返回列表）
- 点击 → `uni.navigateTo` 到对应独立页

### 模块入口映射（路由规划）

| 模块 | 路由 |
|---|---|
| 术前病历 | `/pages/report/swl-detail/sqbl/info` |
| 治疗记录 | `/pages/report/swl-detail/treatment/record` |
| 超声报告 | `/pages/report/swl-detail/ultrasound` |
| 随访记录 | `/pages/report/swl-detail/followup` |
| 结石成分 | `/pages/report/swl-detail/composition` |

---

## 4. 5 个子模块 UI 设计

### 4.1 术前病历 sqbl/info.vue（4 步向导 + 7 子项）

```
┌─ 术前病历 ──────────────────────────┐
│  [①病史]─[②检验]─[③影像]─[④诊断]   │  ← 顶部 sticky 步骤条
├─────────────────────────────────────┤
│  病史子项（仅当病史步骤时显示）        │
│  [现病史][既往史][家族史]            │  ← 横滑 chip
│  [结石史][个人史][婚育史*][体征]     │  ← *仅女性显示
│  ─────────────────────────────────   │
│  ┌─ 主诉 ─────────────────────┐    │
│  │ 腰腹疼痛 2 天               │    │
│  └────────────────────────────┘    │
│  ┌─ 症状 ─────────────────────┐    │
│  │ 发热 ☑  呕吐 ☑  恶心 ☑     │    │  ← 阳性绿色 chip
│  │ 尿频 ☐  尿急 ☐  尿痛 ☐     │    │  ← 阴性灰色 chip
│  └────────────────────────────┘    │
└─────────────────────────────────────┘
```

#### 手机端优化（对比 PC 的 24 列 el-row）
- 6 列分组压成 **2 列 grid**（`display: grid; grid-template-columns: 1fr 1fr`）
- 布尔字段用 `up-tag` 显示（☑/☐），不要用 switch
- 文本字段默认折叠 2 行，`up-text` 加 `showMore` 行为
- 病史的 7 个子项做成 **可横滑的 chip 列表**（`scroll-x`），不全展开
- 性别为女时显示"婚育史"chip（参考 PC 的 `medicalHistoryTabs`）

#### 婚育史性别判断代码
```ts
const showMenstrual = computed(() => Number(patient.value.gender) === 2);

const historyChips = computed(() => {
  const base = [
    { key: 'current',    label: '现病史' },
    { key: 'past',       label: '既往病史' },
    { key: 'family',     label: '家族史' },
    { key: 'stone',      label: '既往结石病史' },
    { key: 'personal',   label: '个人史' },
  ];
  if (showMenstrual.value) {
    base.splice(5, 0, { key: 'menstrual', label: '婚育史' });
  }
  base.push({ key: 'vital', label: '体征' });
  return base;
});
```

#### 7 个病史子项
1. 既往病史
2. 家族史
3. 既往结石病史
4. 婚育史（**仅女性**）
5. 个人史
6. 现病史
7. 体征

### 4.2 治疗记录 treatment/record.vue（时间轴）

```
┌─ 治疗记录 ──────────────────────────┐
│                                     │
│  ● 2024-06-01 10:30  第 1 次治疗     │  ← 圆形 dot + 连接线
│  │ ┌──────────────────────────────┐ │
│  │ │ 设备：HK.ESWL-V              │ │
│  │ │ 能量：2.5 级   冲击次数：2400 │ │
│  │ │ 部位：左肾                    │ │
│  │ │ 操作医生：李医生              │ │
│  │ │ 备注：...                     │ │
│  │ └──────────────────────────────┘ │
│                                     │
│  ● 2024-05-15 14:00  第 2 次治疗     │
│  │ ...                              │
└─────────────────────────────────────┘
```

**实现**：用 `view.time-axis > view.time-axis__item` 自定义时间轴，**避免引入额外组件**；卡片用 `up-card`。

### 4.3 超声报告 ultrasound.vue（图文混排）

```
┌─ 超声报告 ──────────────────────────┐
│                                     │
│  📋 报告摘要                          │
│  ┌──────────────────────────────┐   │
│  │ 检查部位：双肾、输尿管、膀胱   │   │
│  │ 结石位置：左肾盂（10mm）       │   │
│  │ 肾积水：轻度                   │   │
│  │ 备注：...                      │   │
│  └──────────────────────────────┘   │
│                                     │
│  🖼️ 影像图片                          │
│  ┌────┐ ┌────┐ ┌────┐              │   ← 横滑 grid
│  │ 1  │ │ 2  │ │ 3  │              │
│  └────┘ └────┘ └────┘              │
│                                     │
│  [点击查看大图]                      │
└─────────────────────────────────────┘
```

**实现要点**：
- 图片用 `scroll-view` 横滑展示
- 集成 `uni.previewImage` 实现点击放大
- 上传用已有的 `useUpload` composable

### 4.4 随访记录 followup.vue（3 子 Tab）

```
┌─ 随访记录 ──────────────────────────┐
│  [近期] [远期] [疗效]                │  ← up-tabs
│                                     │
│  📅 2024-06-15  术后 2 周            │  ← 卡片
│  ┌──────────────────────────────┐   │
│  │ 随访方式：电话                │   │
│  │ 症状：腰痛 ☑  血尿 ☐         │   │
│  │ 备注：症状减轻，继续观察      │   │
│  └──────────────────────────────┘   │
│                                     │
│  📅 2024-06-29  术后 4 周            │
│  ...                                │
└─────────────────────────────────────┘
```

**3 个 Tab 共享列表组件**，通过 `followupType=near/future/curative` 区分数据。

### 4.5 结石成分 composition.vue（图表 + 列表）

```
┌─ 结石成分 ──────────────────────────┐
│                                     │
│  📊 成分占比                          │
│  ┌──────────────────────────────┐   │
│  │   <环形进度图 / 条形图>       │   │  ← 用 uni-app canvas
│  │   草酸钙 65%                  │   │
│  │   磷酸钙 20%                  │   │
│  │   尿酸  15%                   │   │
│  └──────────────────────────────┘   │
│                                     │
│  📋 详细成分                          │
│  ┌──────────────────────────────┐   │
│  │ 草酸钙    65%  ████████░░     │   │
│  │ 磷酸钙    20%  ██░░░░░░░░     │   │
│  │ 尿酸      15%  █░░░░░░░░░     │   │
│  └──────────────────────────────┘   │
│                                     │
│  💊 防治建议                          │
│  多饮水、低草酸饮食...               │
└─────────────────────────────────────┘
```

**注意**：PC 端有该模块（待您后续确认结构）。

---

## 5. 视觉规范

| 元素 | 配色 |
|---|---|
| 5 个模块主题色 | 术前病历 🟢 #18c06a / 治疗记录 🔵 #2979ff / 超声报告 🟣 #7c4dff / 随访记录 🟠 #ff9500 / 结石成分 🩷 #ff5e8a |
| 九宫格卡片 | 纯白 + 圆角 20rpx + 浅阴影 |
| 模块图标 | `up-icon` 配 `size=48` + 主题色 |
| 摘要标签 | `up-tag` size=mini |
| 已完成/未填写 | 完成 `success`、未填写 `info plain` |
| 进行中状态 | `warning` 圆点 |
| 卡片背景 | 纯白 + `box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.04)`（比 PC 端更轻盈） |
| 标签 Tag | 阳性用 `up-tag type="success"`，阴性用 `up-tag type="info" plain` |
| 患者信息条 | 渐变背景 `linear-gradient(135deg, #e8f7f0, #d4ecf9)`（医疗蓝绿色） |

---

## 6. 文件清单

### 前端
```
uni_frontend/pages/report/
  ├─ components/swl-report.vue                    # 列表页（替换占位）
  ├─ swl-detail.vue                                # 新增：九宫格详情页
  └─ swl-detail/
       ├─ sqbl/info.vue                            # 术前病历（4 步 + 7 子项）
       ├─ treatment/record.vue                     # 治疗记录
       ├─ ultrasound.vue                           # 超声报告
       ├─ followup.vue                             # 随访记录（3 子 Tab）
       └─ composition.vue                          # 结石成分
uni_frontend/pages.json                            # 注册 7 个新页面
uni_frontend/composables/useService.ts             # 新增 swl 服务
```

### 后端（移植自 PC）
```
uni_backend_uview/src/modules/swl/
  ├─ swl.module.ts
  ├─ register/                    # 主表 + 列表
  ├─ history/                     # 7 个病史子模块
  │   ├─ past-medical
  │   ├─ family
  │   ├─ past-stone
  │   ├─ personal
  │   ├─ menstrual-marriage       # 仅女性使用
  │   ├─ current
  │   └─ vital-signs
  ├─ lab/                         # 检验
  ├─ imaging/                     # 影像
  ├─ diagnosis/                   # 诊断
  ├─ treatment/                   # 治疗记录
  ├─ ultrasound/                  # 超声报告
  ├─ followup/                    # 随访（near/future/curative）
  └─ composition/                 # 结石成分（待检查）
```

### 移植方式
1. 从 `D:/git/multi-disease-platform/backend/src/modules/swl/` 复制所有 controller/service/entity/dto
2. 删除 PC 端的 `useSwl()` 等前端依赖
3. 调整路径别名 `@/` → `src/`
4. 注册到 `app.module.ts`
5. 在 `useService.ts` 暴露 `service.swl` 接口

---

## 7. 实施步骤（每步需用户确认）

### ✅ Step 1: 初始化 SWL 后端模块（移植自 PC）
- [ ] 从 PC 端 `multi-disease-platform/backend/src/modules/swl/` 复制所有文件
- [ ] 调整路径别名、删除前端依赖
- [ ] 在 `app.module.ts` 注册 SwlModule
- [ ] 启动后端验证 `getByPatientNo` 列表接口

### ✅ Step 2: 实现列表页 swl-report.vue
- [ ] 替换占位的"功能开发中"组件
- [ ] 复用 `etiology-report.vue` 卡片样式
- [ ] 在 `useService.ts` 添加 `service.swl.register.getByPatientNo`
- [ ] 验证卡片点击可跳转到详情页

### ✅ Step 3: 实现九宫格详情页 swl-detail.vue
- [ ] 顶部患者信息卡
- [ ] 3x2 九宫格（5 个模块 + 1 个"返回列表"）
- [ ] 注册 5 个子页面路由
- [ ] 验证 5 个入口可点击跳转

### ✅ Step 4: 实现治疗记录 + 超声报告子页
- [ ] 治疗记录：时间轴布局
- [ ] 超声报告：图文混排 + 大图预览
- [ ] 验证两个模块可正常显示

### ✅ Step 5: 实现术前病历 4 步向导 + 7 个病史子项
- [ ] 顶部 sticky 步骤条
- [ ] 横滑 chip 切换病史子项
- [ ] 性别判断：女性显示"婚育史"
- [ ] 验证可切换 4 步 + 7 子项

### ✅ Step 6: 实现随访记录（3 子 Tab）
- [ ] up-tabs 顶部 Tab
- [ ] 共享列表组件
- [ ] 通过 `followupType` 参数区分数据

### ✅ Step 7: 实现结石成分模块
- [ ] （待您检查 PC 端结构后实施）
- [ ] 图表 + 列表 + 防治建议

---

## 8. 风险与注意事项

| 风险点 | 应对 |
|---|---|
| PC 端使用了 `useSwl()` 等前端状态管理 hook | 移植时删除相关依赖，纯 NestJS 控制器/服务 |
| TypeORM 实体路径可能不一致 | 统一调整为 `src/entities/` |
| PC 端鉴权可能与手机端不同 | 复用 `JwtAuthGuard` |
| 后端依赖 PC 端的 `dict` 模块 | 确认手机端是否有 dict 模块（已存在 ✅） |
| 图表库选型 | 使用 `qiun-data-charts` 或原生 canvas（待定） |

---

## 9. 进度跟踪

每完成一步后，更新本文档对应小节的 `[ ]` 为 `[x]`，并在对话中与用户确认。

| 步骤 | 状态 | 完成日期 |
|---|---|---|
| Step 1: 后端移植 | ✅ 已完成（register 模块基础版） | 2026-06-13 |
| Step 2: 列表页 | ✅ 已完成 | 2026-06-13 |
| Step 3: 九宫格详情 | ⏳ 未开始 | - |
| Step 4: 治疗记录 + 超声报告 | ⏳ 未开始 | - |
| Step 5: 术前病历 | ⏳ 未开始 | - |
| Step 6: 随访记录 | ⏳ 未开始 | - |
| Step 7: 结石成分 | ⏳ 未开始 | - |
