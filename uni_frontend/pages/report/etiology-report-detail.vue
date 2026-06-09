<template>
	<page-wrapper :padding="24">
		<view v-if="loading" class="loading">
			<up-text text="加载中..." />
		</view>

		<view v-else-if="!detail" class="empty">
			<up-text text="暂无数据" />
		</view>

		<view v-else class="detail-page">
			<!-- 患者信息卡片 -->
			<up-card :border="false" :customStyle="{ marginBottom: '24rpx' }">
				<template #head>
					<up-text bold size="large" text="患者信息" />
				</template>
				<template #body>
					<view class="info-grid">
						<view class="info-item">
							<up-text size="small" color="info" text="档案号" />
							<up-text size="small" :text="detail.patientNo || '-'" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="患者姓名" />
							<up-text size="small" :text="detail.name || '-'" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="性别" />
							<up-text size="small" :text="detail.gender || '-'" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="年龄" />
							<up-text size="small" :text="detail.age || '-'" />
						</view>
					</view>
				</template>
			</up-card>

			<!-- 评估信息卡片 -->
			<up-card :border="false" :customStyle="{ marginBottom: '24rpx' }">
				<template #head>
					<up-text bold size="large" text="评估信息" />
				</template>
				<template #body>
					<view class="info-grid">
						<view class="info-item">
							<up-text size="small" color="info" text="评估号" />
							<up-text size="small" :text="detail.swlNo || '-'" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="评估类型" />
							<up-text size="small" :text="getAssessmentTypeName(detail.assessmentType)" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="次数" />
							<up-text size="small" :text="String(detail.assessmentCount) || '-'" />
						</view>
						<view class="info-item">
							<up-text size="small" color="info" text="评估时间" />
							<up-text size="small" :text="formatDate(detail.assessmentDate) || '-'" />
						</view>
					</view>
				</template>
			</up-card>

			<!-- 防治建议卡片 -->
			<up-card v-if="detail.aiGuideSuggestion" :border="false">
				<template #head>
					<up-text bold size="large" text="防治建议" />
				</template>
				<template #body>
					<up-text size="small" :text="detail.aiGuideSuggestion" />
				</template>
			</up-card>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";
import pageWrapper from "@/components/page-wrapper.vue";

interface EtiologyReportDetail {
	name: string;
	patientNo: string;
	age: string;
	gender: string;
	swlNo: string;
	assessmentCount: number | string;
	assessmentDate: string;
	assessmentType: string;
	aiGuideSuggestion: string;
}

const detail = ref<EtiologyReportDetail | null>(null);
const loading = ref(false);

function getAssessmentTypeName(type: string): string {
	const typeMap: Record<string, string> = {
		mua1: "简化评估",
		mua2: "全面评估",
		mua3: "特殊评估",
	};
	return typeMap[type] || type || '-';
}

function formatDate(date: string): string {
	if (!date) return "-";
	try {
		const d = new Date(date);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch (e) {
		return date;
	}
}

async function loadDetail() {
	const { swlNo, assessmentCount, assessmentType, assessmentDate } = useRouter().getQuery();

	if (!swlNo) {
		uni.showToast({ title: "参数错误", icon: "none" });
		return;
	}

	loading.value = true;
	try {
		const currentPatient = storage.get("currentPatient");
		if (!currentPatient || !currentPatient.patientNo) {
			uni.showToast({ title: "请先选择就诊人", icon: "none" });
			return;
		}

		detail.value = {
			name: currentPatient.name || '-',
			patientNo: currentPatient.patientNo || '-',
			age: currentPatient.age || getAge(currentPatient.idCard),
			gender: currentPatient.gender || getGender(currentPatient.idCard),
			swlNo: swlNo as string,
			assessmentCount: assessmentCount || '-',
			assessmentType: assessmentType as string,
			assessmentDate: assessmentDate as string,
			aiGuideSuggestion: '',
		};

		const res = await service.etiology.muaInfo.getMuaContentByPatientNoAndSwlNo({
			patientNo: currentPatient.patientNo,
			swlNo: swlNo,
			assessmentCount: assessmentCount,
			assessmentType: assessmentType,
		});

		if (res) {
			detail.value.aiGuideSuggestion = res.aiGuideSuggestion || '暂无防治建议';
		}
	} catch (error: any) {
		console.error("加载详情失败:", error);
		uni.showToast({ title: error.message || "加载失败", icon: "none" });
	} finally {
		loading.value = false;
	}
}

function getAge(idCard: string) {
	if (!idCard || idCard.length < 18) return "-";
	const birthYear = idCard.substring(6, 10);
	return String(new Date().getFullYear() - parseInt(birthYear)) + "岁";
}

function getGender(idCard: string) {
	if (!idCard || idCard.length < 18) return "-";
	return idCard.substring(16, 17) % 2 === 0 ? "女" : "男";
}

onMounted(() => {
	loadDetail();
});
</script>

<style lang="scss" scoped>
.loading, .empty {
	padding: 100rpx;
	text-align: center;
}

.detail-page {
	.info-grid {
		display: flex;
		flex-wrap: wrap;
	}

	.info-item {
		width: 50%;
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
		box-sizing: border-box;
	}
}
</style>
