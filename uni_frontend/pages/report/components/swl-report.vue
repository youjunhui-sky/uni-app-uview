<template>
	<view class="swl-report">
		<!-- 加载中 -->
		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>

		<!-- 列表 -->
		<up-card
			v-for="item in list"
			:key="item.id"
			:customStyle="{ marginBottom: '20rpx' }"
			:border="false"
			@click="handleViewDetail(item)"
		>
			<template #head>
				<view class="card-header">
					<text class="card-title">诊疗号：{{ item.swlNo }}</text>
					<up-tag :type="getStatusTagType(item)" size="medium" plain>
						{{ getStatusText(item) }}
					</up-tag>
				</view>
			</template>
			<template #body>
				<view class="card-content">
					<view class="info-row">
						<text class="info-label">患者姓名</text>
						<text class="info-value">{{ item.name || "-" }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">碎石号</text>
						<text class="info-value">{{ item.serialNumber || "-" }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">就诊日期</text>
						<text class="info-value">{{ item.visitDate || "-" }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">期数 / 序列号</text>
						<text class="info-value">
							第 {{ item.episode || 1 }} 期 / 序列 {{ item.sequenceNo || 1 }}
						</text>
					</view>
					<view v-if="item.doctor" class="info-row">
						<text class="info-label">接诊医生</text>
						<text class="info-value">{{ item.doctor }}</text>
					</view>
				</view>
			</template>
		</up-card>

		<!-- 空状态 -->
		<view v-if="!loading && list.length === 0" class="empty-state">
			<up-text text="暂无 SWL 诊疗记录" color="info" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { ref, onMounted } from "vue";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";

export interface SwlReportItem {
	id: number;
	patientNo: string;
	swlNo: string;
	serialNumber: string;
	department?: string;
	visitDate: string;
	age?: string;
	sequenceNo: number;
	episode: number;
	height?: number;
	weight?: number;
	bmi?: number;
	specialCondition?: string;
	doctor?: string;
	name?: string;
	gender?: string;
	mobile?: string;
	[key: string]: any;
}

const list = ref<SwlReportItem[]>([]);
const loading = ref(false);

/**
 * 状态标签：当前默认"已登记"
 * 后续如需展示治疗中/已完成等状态，可由后端新增 status 字段
 */
function getStatusText(item: SwlReportItem): string {
	// 占位策略：可基于 visitDate 与当前时间的关系判断
	return "已登记";
}

function getStatusTagType(item: SwlReportItem): "primary" | "success" | "warning" | "info" {
	return "primary";
}

function handleViewDetail(item: SwlReportItem) {
	useRouter().push({
		path: "/pages/report/swl-detail",
		query: {
			id: String(item.id),
			swlNo: item.swlNo,
			patientNo: item.patientNo,
			name: item.name || "",
			gender: item.gender || "",
		},
	});
}

async function loadReportList() {
	const currentPatient = storage.get("currentPatient");
	if (!currentPatient || !currentPatient.patientNo) {
		uni.showToast({
			title: "请先选择就诊人",
			icon: "none",
		});
		return;
	}

	loading.value = true;
	try {
		const res = await service.swl.register.getByPatientNo({
			patientNo: currentPatient.patientNo,
		});
		logger.log("SWL 诊疗列表 res", res);
		if (Array.isArray(res)) {
			list.value = res;
		} else if (res && typeof res === "object") {
			list.value = res.list || res.data || res.items || [];
		} else {
			list.value = [];
		}
	} catch (error: any) {
		logger.error("加载 SWL 诊疗列表失败:", error);
		uni.showToast({
			title: error.message || "加载失败",
			icon: "none",
		});
		list.value = [];
	} finally {
		loading.value = false;
	}
}

onMounted(() => {
	loadReportList();
});
</script>

<style lang="scss" scoped>
.swl-report {
	padding-bottom: 24rpx;

	.loading-state {
		padding: 60rpx 0;
		text-align: center;
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.card-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #303133;
	}

	.card-content {
		padding: 10rpx 0;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		&:last-child {
			border-bottom: none;
		}
	}

	.info-label {
		font-size: 28rpx;
		color: #909193;
	}

	.info-value {
		font-size: 28rpx;
		color: #303133;
	}

	.empty-state {
		padding: 80rpx 40rpx;
		text-align: center;
	}
}
</style>
