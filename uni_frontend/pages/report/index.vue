<template>
	<page-wrapper>
		<!-- Tab 页 -->
		<view class="report-tabs">
			<up-tabs
				v-model="activeTab"
				:list="tabList"
				keyName="label"
			/>
		</view>

		<!-- 代谢评估列表 -->
		<view v-if="activeTab === 'etiology'" class="report-content">
			<etiology-report />
		</view>

		<!-- SWL诊疗组件 -->
		<view v-if="activeTab === 'swl'" class="report-content">
			<swl-report />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import SwlReport from "./components/swl-report.vue";
import EtiologyReport from "./components/etiology-report.vue";
import pageWrapper from "@/components/page-wrapper.vue";

const activeTab = ref<"etiology" | "swl">("etiology");

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