<template>
	<page-wrapper>
		<!-- Tab 页 -->
		<view class="report-tabs">
			<up-tabs
				v-model:current="activeTab"
				:list="tabList"
				keyName="label"
			/>
		</view>

		<!-- 代谢评估列表 -->
		<view v-if="activeTab === 0" class="report-content">
			<etiology-report />
		</view>

		<!-- SWL诊疗组件 -->
		<view v-if="activeTab === 1" class="report-content">
			<swl-report />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SwlReport from "./components/swl-report.vue";
import EtiologyReport from "./components/etiology-report.vue";
import pageWrapper from "@/components/page-wrapper.vue";

// 注意 1：up-tabs 的 v-model 绑定的是**索引**（数字 0/1），不是 value
// 注意 2：u-tabs 没有 Vue 3 默认的 modelValue，必须用**具名 v-model** `v-model:current`
//        （prop 名 = current，事件名 = update:current）
const activeTab = ref<number>(0);

const tabList = ref([
	{
		label: "代谢评估",
		value: "etiology",
	},
	{
		label: "SWL诊疗",
		value: "swl",
	},
]);
</script>

<style lang="scss" scoped>
.report-tabs {
	background: #fff;
	padding: 0 24rpx;
	margin-bottom: 24rpx;
	position: sticky;
	top: 0;
	z-index: 10;
}

.report-content {
	padding: 0 24rpx 24rpx;
}
</style>