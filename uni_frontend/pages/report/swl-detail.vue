<template>
	<page-wrapper>
		<!-- 患者信息卡 -->
		<view class="patient-card">
			<view class="patient-card__header">
				<view class="patient-card__avatar">
					<up-text :text="nameInitial" color="#fff" bold size="large" />
				</view>
				<view class="patient-card__basic">
					<view class="patient-card__name-row">
						<up-text :text="query.name || '-'" color="#fff" bold size="large" />
						<up-tag :text="genderText" type="primary" size="mini" plain />
					</view>
					<up-text :text="`碎石号：${query.swlNo || '-'}`" color="rgba(255,255,255,0.85)" size="small" />
				</view>
			</view>
			<view class="patient-card__meta">
				<view class="meta-item">
					<up-text text="档案号" size="mini" color="rgba(255,255,255,0.7)" />
					<up-text :text="query.patientNo || '-'" size="small" color="#fff" />
				</view>
				<view class="meta-item">
					<up-text text="诊疗 ID" size="mini" color="rgba(255,255,255,0.7)" />
					<up-text :text="query.id || '-'" size="small" color="#fff" />
				</view>
				<view class="meta-item">
					<up-text text="状态" size="mini" color="rgba(255,255,255,0.7)" />
					<up-text text="进行中" size="small" color="#fff" />
				</view>
			</view>
		</view>

		<!-- 9 宫格模块入口 -->
		<view class="module-grid">
			<up-text text="诊疗模块" size="medium" bold block :customStyle="{ marginBottom: '16rpx' }" />
			<view class="grid">
				<view
					v-for="(item, idx) in modules"
					:key="idx"
					class="grid-item"
					:style="{ background: item.bg }"
					@click="handleModuleClick(item)"
				>
					<view class="grid-item__icon">
						<Icon :name="item.icon" :size="44" :color="item.color" />
					</view>
					<up-text :text="item.title" size="small" bold color="#303133" />
					<up-text :text="item.summary" size="mini" color="#909193" />
				</view>
			</view>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import Icon from "@/components/icon.vue";
import { useRouter } from "@/composables/useRouter";
import pageWrapper from "@/components/page-wrapper.vue";

interface ModuleItem {
	key: string;
	title: string;
	summary: string;
	icon: string;
	color: string;
	bg: string;
	path?: string;
}

const router = useRouter();
const query = ref<Record<string, string>>({});

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

/**
 * 9 宫格：5 个诊疗模块 + 1 个"返回列表"
 * 顺序：术前病历 / 治疗记录 / 超声报告 / 随访记录 / 结石成分 / 返回列表
 */
const modules = ref<ModuleItem[]>([
	{
		key: "sqbl",
		title: "术前病历",
		summary: "病史·检验·影像·诊断",
		icon: "mdi:clipboard-pulse",
		color: "#18c06a",
		bg: "linear-gradient(135deg, #e8f7f0, #d4f0e1)",
		path: "/pages/report/swl-detail/sqbl/info",
	},
	{
		key: "treatment",
		title: "治疗记录",
		summary: "冲击波治疗过程",
		icon: "mdi:pill",
		color: "#2979ff",
		bg: "linear-gradient(135deg, #e3f0ff, #c9e0ff)",
		path: "/pages/report/swl-detail/treatment/record",
	},
	{
		key: "ultrasound",
		title: "超声报告",
		summary: "影像与摘要",
		icon: "mdi:image-outline",
		color: "#7c4dff",
		bg: "linear-gradient(135deg, #efe7ff, #dccaff)",
		path: "/pages/report/swl-detail/ultrasound",
	},
	{
		key: "followup",
		title: "随访记录",
		summary: "近期·远期·疗效",
		icon: "mdi:phone",
		color: "#ff9500",
		bg: "linear-gradient(135deg, #fff3e0, #ffe0b3)",
		path: "/pages/report/swl-detail/followup",
	},
	{
		key: "composition",
		title: "结石成分",
		summary: "成分分析",
		icon: "mdi:flask-outline",
		color: "#ff5e8a",
		bg: "linear-gradient(135deg, #ffe7ee, #ffc8d6)",
		path: "/pages/report/swl-detail/composition",
	},
	{
		key: "back",
		title: "返回列表",
		summary: "查看其他诊疗",
		icon: "mdi:arrow-left",
		color: "#909193",
		bg: "linear-gradient(135deg, #f5f7fa, #e4e7ed)",
	},
]);

const nameInitial = computed(() => {
	const n = query.value.name || "?";
	return n.substring(0, 1);
});

const genderText = computed(() => {
	const g = query.value.gender;
	if (g === "1" || g === "男") return "男";
	if (g === "2" || g === "女") return "女";
	return "-";
});

function handleModuleClick(item: ModuleItem) {
	if (item.key === "back") {
		uni.navigateBack({ delta: 1 });
		return;
	}
	if (!item.path) return;
	router.push({
		path: item.path,
		query: {
			id: query.value.id,
			swlNo: query.value.swlNo,
			patientNo: query.value.patientNo,
			name: query.value.name,
			gender: query.value.gender,
		},
	});
}
</script>

<style lang="scss" scoped>
.patient-card {
	margin: 24rpx;
	padding: 32rpx 28rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #18c06a 0%, #0fa37e 100%);
	box-shadow: 0 8rpx 24rpx rgba(24, 192, 106, 0.18);

	&__header {
		display: flex;
		align-items: center;
		margin-bottom: 24rpx;
	}

	&__avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	&__basic {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	&__name-row {
		display: flex;
		align-items: center;
		gap: 12rpx;
	}

	&__meta {
		display: flex;
		justify-content: space-between;
		padding-top: 20rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.2);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 6rpx;
		flex: 1;
		align-items: center;
	}
}

.module-grid {
	margin: 0 24rpx 24rpx;
	padding: 24rpx;
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20rpx;
}

.grid-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 28rpx 12rpx;
	border-radius: 16rpx;
	transition: transform 0.15s ease;

	&:active {
		transform: scale(0.96);
	}

	&__icon {
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 12rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
	}
}
</style>
