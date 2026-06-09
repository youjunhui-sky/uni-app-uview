# 项目说明

## 用户偏好

### 文件修改
- 修改文件时直接使用 Write/Edit 工具，不要使用 `cat > file << 'EOF'` 这种 heredoc 方式
- 修改完成后由用户自行验证

### 问题排查
- 发现问题后直接修改文件，不要让用户执行命令来排查
- 如果需要浏览器控制台信息，先猜测可能的原因并修复，让用户验证

## 技术栈

### uni-frontend
- uni-app + Vue 3 项目
- 使用 uview-plus 作为 UI 组件库
- 使用 @cool-vue/vite-plugin 处理虚拟模块
- 运行命令: `npm run dev:h5`

### uni-backend
- Node.js 后端服务

## 常见问题

### uview-plus 组件 text 属性
**【强制】** uview-plus 的 `up-text` 组件必须使用 `text` 属性来显示文字，禁止使用插槽内容：

```html
<!-- 正确 ✅ -->
<up-text text="显示文字" />
<up-text :text="variableText" />
<up-text size="small" color="info" text="标签文字" block />

<!-- 错误 ❌ -->
<up-text>显示文字</up-text>
<up-text size="small">显示文字</up-text>
```

### uview-plus popup 组件
`up-popup` 组件必须使用 `show` 属性控制显示，而不是 v-show：

```html
<!-- 正确 ✅ -->
<up-popup :show="visible" mode="bottom" @close="visible = false">

<!-- 错误 ❌ -->
<up-popup v-show="visible">
```

### uview-plus icon 组件
`up-icon` 组件必须使用 `name` 属性指定图标：

```html
<!-- 正确 ✅ -->
<up-icon name="close" :size="32" color="#999" @click="close" />
<up-icon name="arrow-right" :size="18" color="#999" />

<!-- 错误 ❌ -->
<up-icon size="32">close</up-icon>
```

### uview-plus tabs 组件
`up-tabs` 组件默认使用 `name` 字段，需要通过 `keyName="label"` 指定字段名：
```html
<up-tabs :list="tabList" keyName="label" />
```

### uview-plus card 组件
`up-card` 组件的内容应该放在 `#body` 插槽中：
```html
<up-card>
  <template #head>标题</template>
  <template #body>内容</template>
</up-card>
```

### SCSS 变量注入
vite.config.ts 需要配置 SCSS 变量注入才能使用 uview-plus 的主题变量和 mixin：
```ts
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `
        @import "uview-plus/theme.scss";
        @import "uview-plus/libs/css/mixin.scss";
      `,
    },
  },
},
```

### 代理配置
开发环境需要配置 proxy 将请求转发到后端：
```ts
import { proxy } from "./config/proxy";

server: {
  proxy,
}
```