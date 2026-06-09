<template>
	<view class="page-wrapper" :style="{ backgroundColor: backgroundColor, padding: padding }">
		<!-- 状态栏 -->
		<up-status-bar :fixed="false" />

		<!-- 页面内容插槽 -->
		<slot></slot>

		<!-- 全局 Toast -->
		<up-toast ref="toastRef" />

		<!-- 全局 Modal -->
		<up-modal ref="modalRef" />
	</view>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface Props {
	backgroundColor?: string;
	padding?: string;
}

const props = withDefaults(defineProps<Props>(), {
	backgroundColor: "#f6f7fa",
	padding: "0",
});

const toastRef = ref();
const modalRef = ref();

// 导出 toast/modal 方法供外部调用
defineExpose({
	toast: (options: any) => toastRef.value?.show(options),
	modal: (options: any) => modalRef.value?.show(options),
});
</script>

<style lang="scss">
.page-wrapper {
	min-height: 100vh;
	box-sizing: border-box;
}
</style>