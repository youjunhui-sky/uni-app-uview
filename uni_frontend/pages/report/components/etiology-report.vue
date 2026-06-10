<template>
	<view class="etiology-report">
		<up-card
			v-for="(item, index) in list"
			:key="index"
			:customStyle="{ marginBottom: '20rpx' }"
			:border="false"
			@click="handleViewDetail(item)"
		>
			<template #head>
				<view class="card-header">
					<text class="card-title">评估号：{{ item.swlNo }}</text>
					<up-tag :type="getAssessmentTypeTag(item.assessmentType)" size="medium">
						{{ getAssessmentTypeName(item.assessmentType) }}
					</up-tag>
				</view>
			</template>
			<template #body>
				<view class="card-content">
					<view class="info-row">
						<text class="info-label">评估时间</text>
						<text class="info-value">{{ formatDate(item.assessmentDate) }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">次数</text>
						<text class="info-value">{{ item.assessmentCount }}</text>
					</view>
				</view>
			</template>
		</up-card>

		<view v-if="list.length === 0 && !loading" class="empty-state">
			<text>暂时没有代谢评估报告</text>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";

export interface EtiologyReportItem {
	id?: string | number;
	swlNo: string;
	assessmentCount: number | string;
	assessmentDate: string;
	assessmentType: "mua1" | "mua2" | "mua3";
	[key: string]: any;
}

const list = ref<EtiologyReportItem[]>([]);
const loading = ref(false);

function getAssessmentTypeName(type: string): string {
	const typeMap: Record<string, string> = {
		mua1: "简化评估",
		mua2: "全面评估",
		mua3: "特殊评估",
	};
	return typeMap[type] || type;
}

function getAssessmentTypeTag(type: string): "primary" | "success" | "warning" {
	const tagMap: Record<string, "primary" | "success" | "warning"> = {
		mua1: "primary",
		mua2: "success",
		mua3: "warning",
	};
	return tagMap[type] || "primary";
}

function formatDate(date: string): string {
	if (!date) return "";
	try {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	} catch (e) {
		return date;
	}
}

function handleViewDetail(item: EtiologyReportItem) {
	useRouter().push({
		path: "/pages/report/etiology-report-detail",
		query: {
			assessmentDate: formatDate(item.assessmentDate),
			assessmentCount: item.assessmentCount,
			assessmentType: item.assessmentType,
			swlNo: item.swlNo,
			id: item.id,
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
		const res = await service.etiology.muaInfo.getMuaInfoByPatientNo({
			patientNo: currentPatient.patientNo,
		});
		console.log("res", res);
		if (Array.isArray(res)) {
			list.value = res;
		} else if (res && typeof res === "object") {
			list.value = res.list || res.data || [];
		} else {
			list.value = [];
		}
	} catch (error: any) {
		console.error("加载代谢评估报告失败:", error);
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
.etiology-report {
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
		padding: 40rpx;
		text-align: center;
		color: #909193;
		font-size: 26rpx;
	}
}
</style>

