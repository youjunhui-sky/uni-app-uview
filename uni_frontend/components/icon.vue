<!--
  图标组件 - 本地 SVG 渲染（局域网环境，替代 Iconify 在线 CDN）
  用法:
    <Icon name="mdi:arrow-left" :size="16" color="#333" />
    <Icon name="mdi:arrow-right" :size="18" />
  说明:
    - 名称格式为 "集合:图标名"，当前仅支持 mdi 集合
    - 新增图标时，请在 @/utils/mdi-icons.ts 中补充 body 数据
-->
<script setup lang="ts">
import { computed } from "vue";
import { mdiIcons, getMdiIcon } from "@/utils/mdi-icons";

const props = defineProps<{
	// 图标名称，格式为 "集合:图标名"，如 "mdi:arrow-left"
	name: string;
	// 图标大小
	size?: string | number;
	// 图标颜色
	color?: string;
}>();

const iconBody = computed(() => getMdiIcon(props.name)?.body ?? "");
const width = computed(() => props.size ?? mdiIcons.width);
const height = computed(() => props.size ?? mdiIcons.height);
</script>

<template>
	<svg
		v-if="iconBody"
		class="up-icon-svg"
		:width="width"
		:height="height"
		:viewBox="`0 0 ${mdiIcons.width} ${mdiIcons.height}`"
		:style="{ color: color || 'inherit' }"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		v-html="iconBody"
	/>
</template>

<style lang="scss" scoped>
.up-icon-svg {
	display: inline-block;
	vertical-align: middle;
	fill: currentColor;
}
</style>
