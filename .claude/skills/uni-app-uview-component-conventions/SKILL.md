---
name: uni-app-uview-component-conventions
description: Use when writing or editing Vue components that use uview-plus (`up-*`) in `uni_frontend/`. Enforces the project component usage rules from CLAUDE.md.
---

# uview-plus 强制组件用法

改 `uni_frontend/**/*.vue` 时**必须**遵守以下规则（与项目根 [CLAUDE.md](../../CLAUDE.md) 同源；这里是显式触发层，不依赖 CLAUDE.md 自动注入）。

## 1. `up-text` 必须用 `text` 属性
```html
<!-- 正确 -->
<up-text text="显示文字" />
<up-text :text="variableText" />
<up-text size="small" color="info" text="标签文字" block />

<!-- 错误 -->
<up-text>显示文字</up-text>
<up-text size="small">显示文字</up-text>
```

## 2. `up-popup` 必须用 `:show` 控制
```html
<!-- 正确 -->
<up-popup :show="visible" mode="bottom" @close="visible = false">

<!-- 错误 -->
<up-popup v-show="visible">
```

## 3. `up-icon` 必须用 `name` 属性
```html
<!-- 正确 -->
<up-icon name="close" :size="32" color="#999" @click="close" />
<up-icon name="arrow-right" :size="18" color="#999" />

<!-- 错误 -->
<up-icon size="32">close</up-icon>
```

## 4. `up-tabs` 必须用具名 v-model + keyName
```html
<!-- 正确 -->
<up-tabs v-model:current="activeTab" :list="tabList" keyName="label" />
<view v-if="activeTab === 0">第一个 tab 的内容</view>

<!-- 错误 -->
<up-tabs v-model="activeTab" :list="tabList" />
<view v-if="activeTab === 'etiology'">  <!-- 永远是 false -->
```

**注意**: `v-model:current` 绑定的是**数字索引**（0/1/2...），不是 `value` 字段。

## 5. `up-card` 内容放 `#body` 插槽
```html
<up-card>
  <template #head>标题</template>
  <template #body>内容</template>
</up-card>
```

## 自检命令
写完 Vue 组件后跑：
```bash
# 查 up-text 违规（slot 内有内容）
grep -nE "<up-text[^>]*/?>[^<]+" uni_frontend/<your-file>

# 查 up-popup v-show 违规
grep -nE "<up-popup[^>]*v-show" uni_frontend/<your-file>

# 查 up-tabs v-model 不是 v-model:current
grep -nE "<up-tabs[^>]*v-model=" uni_frontend/<your-file> | grep -v "v-model:current"
```

## 行为
发现违规 → 主动指出并修复；不修复就提交视为不合格。
