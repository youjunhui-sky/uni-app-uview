<template>
	<page-wrapper>
		<!-- 顶部信息条 -->
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}  患者：${query.name || '-'}`" size="small" color="#666" />
		</view>

		<!-- 步骤条：病史 / 检验 / 影像 / 诊断 -->
		<view class="step-bar">
			<view
				v-for="(s, idx) in steps"
				:key="s.key"
				class="step-bar__item"
				:class="{ 'step-bar__item--active': activeStep === idx }"
				@tap="goStep(idx)"
			>
				<view class="step-bar__dot">{{ idx + 1 }}</view>
				<up-text :text="s.label" size="small" :color="activeStep === idx ? '#18c06a' : '#666'" />
				<view v-if="idx < steps.length - 1" class="step-bar__line"></view>
			</view>
		</view>

		<!-- 病史子步骤条（仅在病史步骤时显示） -->
		<view v-if="activeStep === 0" class="sub-tabs">
			<scroll-view scroll-x class="sub-tabs__scroll">
				<view
					v-for="(t, idx) in historyChips"
					:key="t.key"
					class="sub-tabs__chip"
					:class="{ 'sub-tabs__chip--active': activeSubTab === idx }"
					@tap="goSubTab(idx)"
				>
					<up-text :text="t.label" size="mini" :color="activeSubTab === idx ? '#fff' : '#666'" />
				</view>
			</scroll-view>
		</view>

		<!-- 内容区 -->
		<view class="content" v-if="!loading">
			<!-- ===== 病史 - 现病史 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 0">
				<up-card :border="false" v-for="(item, idx) in currentList" :key="idx" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text text="现病史" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="症状" size="small" color="info" />
								<up-text :text="item.hasSymptom === 1 ? '有' : item.hasSymptom === 0 ? '无' : '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="病程（天）" size="small" color="info" />
								<up-text :text="formatVal(item.diseaseDuration)" size="small" />
							</view>
						</view>
						<up-text text="伴随症状" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
						<view class="tag-row">
							<up-tag text="发热" :type="item.hasFever === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="呕吐" :type="item.hasVomit === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="恶心" :type="item.hasNausea === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="尿频" :type="item.hasFrequentUrination === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="尿急" :type="item.hasUrgentUrination === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="尿痛" :type="item.hasDysuria === 1 ? 'error' : 'info'" plain size="mini" />
							<up-tag text="下腹放射痛" :type="item.hasLowerAbdominalPain === 1 ? 'error' : 'info'" plain size="mini" />
						</view>
						<view class="info-grid" style="margin-top: 16rpx;">
							<view class="info-item">
								<up-text text="肾绞痛部位" size="small" color="info" />
								<up-text :text="item.renalColicLocation || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="肾绞痛特征" size="small" color="info" />
								<up-text :text="item.renalColicCharacter || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="肾绞痛发作次数" size="small" color="info" />
								<up-text :text="item.renalColicCount || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="慢性腰痛" size="small" color="info" />
								<up-text :text="item.hasChronicBackache || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="血尿" size="small" color="info" />
								<up-text :text="item.hasHematuria || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="排尿困难" size="small" color="info" />
								<up-text :text="item.difficultyUrinating || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.chiefComplaint" class="remark">
							<up-text text="主诉" size="small" color="info" />
							<up-text :text="item.chiefComplaint" size="small" block />
						</view>
						<view v-if="item.treatment" class="info-grid" style="margin-top: 16rpx;">
							<view class="info-item">
								<up-text text="治疗方式" size="small" color="info" />
								<up-text :text="item.treatment" size="small" />
							</view>
						</view>
						<view v-if="item.treatmentProcess" class="remark">
							<up-text text="治疗经过" size="small" color="info" />
							<up-text :text="item.treatmentProcess" size="small" block />
						</view>
						<view v-if="item.otherSymptoms" class="remark">
							<up-text text="其他症状" size="small" color="info" />
							<up-text :text="item.otherSymptoms" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="currentList.length === 0" class="empty"><up-text text="暂无现病史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 既往病史 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 1">
				<up-card :border="false" v-for="item in pastMedicalList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text :text="item.diseaseName || '既往疾病'" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="诊断年月" size="small" color="info" />
								<up-text :text="item.diagnosisDate || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="治疗方式" size="small" color="info" />
								<up-text :text="item.treatment || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="是否治愈" size="small" color="info" />
								<up-text :text="item.isCured === 1 ? '是' : item.isCured === 0 ? '否' : '-'" size="small" />
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<up-text text="备注" size="small" color="info" />
							<up-text :text="item.remark" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="pastMedicalList.length === 0" class="empty"><up-text text="暂无既往病史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 家族史 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 2">
				<up-card :border="false" v-for="item in familyList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text :text="item.familyMember || '家族成员'" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="尿石病史" size="small" color="info" />
								<up-text :text="item.urolithiasisHistory === 1 ? '有' : item.urolithiasisHistory === 0 ? '无' : '-'" size="small" />
							</view>
							<view class="info-item" style="grid-column: span 2;">
								<up-text text="其他病史" size="small" color="info" />
								<up-text :text="item.otherDiseases || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<up-text text="备注" size="small" color="info" />
							<up-text :text="item.remark" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="familyList.length === 0" class="empty"><up-text text="暂无家族史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 既往结石病史 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 3">
				<up-card :border="false" v-for="item in pastStoneList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text :text="item.diagnosis || '既往结石'" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="诊断年月" size="small" color="info" />
								<up-text :text="item.diagnosisDate || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="治疗过程" size="small" color="info" />
								<up-text :text="item.treatmentProcess || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="疗效" size="small" color="info" />
								<up-text :text="item.curativeEffect || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<up-text text="备注" size="small" color="info" />
							<up-text :text="item.remark" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="pastStoneList.length === 0" class="empty"><up-text text="暂无既往结石病史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 个人史 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 4">
				<up-card :border="false" v-for="(item, idx) in personalList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text text="个人史" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="出生地" size="small" color="info" />
								<up-text :text="item.birthplace || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="居住地" size="small" color="info" />
								<up-text :text="item.residence || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="起始居住年月" size="small" color="info" />
								<up-text :text="item.startResidenceDate || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="职业" size="small" color="info" />
								<up-text :text="item.occupation || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="吸烟史" size="small" color="info" />
								<up-text :text="item.smokingHistory || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="饮酒史" size="small" color="info" />
								<up-text :text="item.drinkingHistory || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<up-text text="备注" size="small" color="info" />
							<up-text :text="item.remark" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="personalList.length === 0" class="empty"><up-text text="暂无个人史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 月经婚育史（仅女性） ===== -->
			<view v-if="activeStep === 0 && activeSubTab === 5 && showMenstrual">
				<up-card :border="false" v-for="(item, idx) in menstrualList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text text="月经婚育史" bold size="medium" />
					</template>
					<template #body>
						<view class="info-grid">
							<view class="info-item">
								<up-text text="初潮年龄（岁）" size="small" color="info" />
								<up-text :text="item.menarcheAge || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="周期（天）" size="small" color="info" />
								<up-text :text="item.menstrualCycle || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="经期（天）" size="small" color="info" />
								<up-text :text="item.menstrualPeriod || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="婚姻状况" size="small" color="info" />
								<up-text :text="item.maritalStatus || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="生育次数" size="small" color="info" />
								<up-text :text="item.parity || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="流产次数" size="small" color="info" />
								<up-text :text="item.abortion || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="是否绝经" size="small" color="info" />
								<up-text :text="item.menopause === 1 ? '是' : item.menopause === 0 ? '否' : '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="末次月经" size="small" color="info" />
								<up-text :text="formatDate(item.lastMenstrualDate) || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.remark" class="remark">
							<up-text text="备注" size="small" color="info" />
							<up-text :text="item.remark" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="menstrualList.length === 0" class="empty"><up-text text="暂无月经婚育史" color="info" /></view>
			</view>

			<!-- ===== 病史 - 体征 ===== -->
			<view v-if="activeStep === 0 && activeSubTab === (showMenstrual ? 6 : 5)">
				<up-card :border="false" v-for="item in vitalList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<up-text text="体征" bold size="medium" />
					</template>
					<template #body>
						<up-text text="生命体征" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
						<view class="info-grid">
							<view class="info-item">
								<up-text text="体温" size="small" color="info" />
								<up-text :text="formatVal(item.temperature, ' ℃')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="脉搏" size="small" color="info" />
								<up-text :text="formatVal(item.pulse, ' 次/分')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="呼吸" size="small" color="info" />
								<up-text :text="formatVal(item.respiratoryRate, ' 次/分')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="血压" size="small" color="info" />
								<up-text :text="item.bloodPressure ? item.bloodPressure + ' mmHg' : '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="身高" size="small" color="info" />
								<up-text :text="formatVal(item.height, ' cm')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="体重" size="small" color="info" />
								<up-text :text="formatVal(item.weight, ' kg')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="BMI" size="small" color="info" />
								<up-text :text="formatVal(item.bmi)" size="small" />
							</view>
						</view>
						<up-text text="腹部" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
						<view class="info-grid">
							<view class="info-item">
								<up-text text="腹部压痛点" size="small" color="info" />
								<up-text :text="item.abdominalTenderness || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="位置" size="small" color="info" />
								<up-text :text="item.location || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="肾区叩击痛" size="small" color="info" />
								<up-text :text="item.renalAreaKnockingPain || '-'" size="small" />
							</view>
							<view class="info-item">
								<up-text text="程度" size="small" color="info" />
								<up-text :text="item.painIntensity || '-'" size="small" />
							</view>
						</view>
						<view v-if="item.otherSigns" class="remark">
							<up-text text="其他体征" size="small" color="info" />
							<up-text :text="item.otherSigns" size="small" block />
						</view>
					</template>
				</up-card>
				<view v-if="vitalList.length === 0" class="empty"><up-text text="暂无体征数据" color="info" /></view>
			</view>

			<!-- ===== 检验 ===== -->
			<view v-if="activeStep === 1">
				<view v-for="(group, gi) in labGrouped" :key="gi" class="lab-group">
					<view class="lab-group__head">
						<up-text :text="group.groupName || '其他'" bold size="medium" />
						<up-tag :text="`${group.items.length} 项`" type="primary" size="mini" plain />
					</view>
					<up-card :border="false" v-for="(item, ii) in group.items" :key="ii" :customStyle="{ marginBottom: '12rpx' }">
						<template #body>
							<view class="lab-item">
								<view class="lab-item__head">
									<up-text :text="item.itemName || item.itemCode || '-'" bold size="small" />
									<up-tag v-if="item.resultFlag === 1" text="异常" type="error" size="mini" />
									<up-tag v-else-if="item.resultFlag === 0" text="正常" type="success" size="mini" />
								</view>
								<view class="lab-item__body">
									<up-text :text="formatVal(item.resultValue, item.unit ? ' ' + item.unit : '')" size="small" />
									<up-text v-if="item.qualitativeResult" :text="`(${item.qualitativeResult})`" size="mini" color="info" />
								</view>
								<view v-if="item.referenceRange" class="lab-item__ref">
									<up-text :text="`参考值：${item.referenceRange}`" size="mini" color="info" />
								</view>
							</view>
						</template>
					</up-card>
				</view>
				<view v-if="labGrouped.length === 0" class="empty"><up-text text="暂无检验数据" color="info" /></view>
			</view>

			<!-- ===== 影像 ===== -->
			<view v-if="activeStep === 2">
				<up-card :border="false" v-for="item in imagingList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<view class="card-head">
							<up-text :text="`检查 ${item.serialNumber || ''}`" bold size="medium" />
							<up-text :text="formatDate(item.registerTime)" size="small" color="info" />
						</view>
					</template>
					<template #body>
						<view class="check-types">
							<up-tag v-for="t in checkTypeTags(item)" :key="t.key" :text="t.label" :type="t.has ? 'success' : 'info'" plain size="mini" />
						</view>
						<view class="info-grid" style="margin-top: 16rpx;">
							<view class="info-item">
								<up-text text="CT 值" size="small" color="info" />
								<up-text :text="formatVal(item.ctValue, ' HU')" size="small" />
							</view>
							<view class="info-item">
								<up-text text="登记人" size="small" color="info" />
								<up-text :text="item.registrar || '-'" size="small" />
							</view>
						</view>
					</template>
				</up-card>
				<view v-if="imagingList.length === 0" class="empty"><up-text text="暂无影像数据" color="info" /></view>
			</view>

			<!-- ===== 诊断 ===== -->
			<view v-if="activeStep === 3">
				<up-card :border="false" v-for="item in diagnosisList" :key="item.id" :customStyle="{ marginBottom: '20rpx' }">
					<template #head>
						<view class="card-head">
							<up-text text="临床诊断" bold size="medium" />
							<up-text :text="formatDate(item.diagnosisTime)" size="small" color="info" />
						</view>
					</template>
					<template #body>
						<view v-if="item.diagnosisCode" class="remark">
							<up-text text="诊断结论" size="small" color="info" />
							<up-text :text="item.diagnosisCode" size="small" block />
						</view>
						<view v-if="item.treatmentPlan" class="remark">
							<up-text text="治疗方案" size="small" color="info" />
							<up-text :text="item.treatmentPlan" size="small" block />
						</view>
						<view class="info-grid" style="margin-top: 16rpx;">
							<view class="info-item">
								<up-text text="诊断医生" size="small" color="info" />
								<up-text :text="item.doctor || '-'" size="small" />
							</view>
						</view>
					</template>
				</up-card>
				<view v-if="diagnosisList.length === 0" class="empty"><up-text text="暂无诊断数据" color="info" /></view>
			</view>
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { service } from "@/composables/useService";
import { logger } from "@/utils/logger";

const query = ref<Record<string, string>>({});
const loading = ref(false);

const steps = [
	{ key: "history", label: "病史" },
	{ key: "lab", label: "检验" },
	{ key: "imaging", label: "影像" },
	{ key: "diagnosis", label: "诊断" },
];
const activeStep = ref(0);

/** 病史子项 - 7 个 chip，性别判断后动态生成 */
const showMenstrual = computed(() => {
	const g = query.value.gender;
	return g === "2" || g === "女";
});

const historyChips = computed(() => {
	const list: { key: string; label: string }[] = [
		{ key: "current", label: "现病史" },
		{ key: "past", label: "既往病史" },
		{ key: "family", label: "家族史" },
		{ key: "stone", label: "既往结石病史" },
		{ key: "personal", label: "个人史" },
	];
	if (showMenstrual.value) list.push({ key: "menstrual", label: "月经婚育史" });
	list.push({ key: "vital", label: "体征" });
	return list;
});
const activeSubTab = ref(0);

// 各子项数据
const currentList = ref<any[]>([]);
const pastMedicalList = ref<any[]>([]);
const familyList = ref<any[]>([]);
const pastStoneList = ref<any[]>([]);
const personalList = ref<any[]>([]);
const menstrualList = ref<any[]>([]);
const vitalList = ref<any[]>([]);
const labList = ref<any[]>([]);
const imagingList = ref<any[]>([]);
const diagnosisList = ref<any[]>([]);

const labGrouped = computed(() => {
	const map = new Map<string, { groupCode: string; groupName: string; items: any[] }>();
	for (const it of labList.value) {
		const k = it.groupCode || "other";
		if (!map.has(k)) {
			map.set(k, { groupCode: it.groupCode, groupName: it.groupName, items: [] });
		}
		map.get(k)!.items.push(it);
	}
	return Array.from(map.values());
});

function checkTypeTags(item: any) {
	return [
		{ key: "us", label: "超声", has: item.hasUltrasound === 1 },
		{ key: "kub", label: "KUB", has: item.hasKUB === 1 },
		{ key: "ivu", label: "IVU", has: item.hasIVU === 1 },
		{ key: "ct", label: "CT", has: item.hasCT === 1 },
		{ key: "mri", label: "MRI", has: item.hasMRI === 1 },
		{ key: "ctu", label: "CTU", has: item.hasCTU === 1 },
	];
}

function goStep(idx: number) {
	activeStep.value = idx;
	activeSubTab.value = 0;
}

function goSubTab(idx: number) {
	activeSubTab.value = idx;
}

function formatVal(v?: number | string | null, unit = "") {
	if (v === null || v === undefined || v === "") return "-";
	return `${v}${unit}`;
}

function formatDate(v?: string | Date) {
	if (!v) return "";
	try {
		const d = typeof v === "string" ? new Date(v) : v;
		if (isNaN(d.getTime())) return String(v);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {
		return String(v);
	}
}

async function loadAll() {
	const { swlNo, serialNumber } = query.value;
	if (!swlNo) {
		uni.showToast({ title: "缺少碎石号", icon: "none" });
		return;
	}
	loading.value = true;
	const baseQuery = { swlNo, serialNumber };
	try {
		const [
			current, pastMedical, family, pastStone, personal, menstrual, vital,
			lab, imaging, diagnosis,
		] = await Promise.all([
			service.swl.sqbl.currentHistory.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.pastMedicalHistory.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.familyHistory.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.pastStoneHistory.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.personalHistory.findBySwlNo(baseQuery).catch(() => []),
			showMenstrual.value ? service.swl.sqbl.menstrualMarriageHistory.findBySwlNo(baseQuery).catch(() => []) : Promise.resolve([]),
			service.swl.sqbl.vitalSigns.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.labResult.findBySwlNo(baseQuery).catch(() => []),
			service.swl.sqbl.diagnosis.findBySwlNo(baseQuery).catch(() => []),
			service.swl.imaging.findBySwlNo(baseQuery).catch(() => []),
		]);
		currentList.value = current;
		pastMedicalList.value = pastMedical;
		familyList.value = family;
		pastStoneList.value = pastStone;
		personalList.value = personal;
		menstrualList.value = menstrual;
		vitalList.value = vital;
		labList.value = lab;
		diagnosisList.value = diagnosis;
		imagingList.value = imaging;
		logger.log("sqbl all data loaded");
	} catch (error: any) {
		logger.error("加载术前病历失败:", error);
		uni.showToast({ title: error.message || "加载失败", icon: "none" });
	} finally {
		loading.value = false;
	}
}

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
	loadAll();
});
</script>

<style lang="scss" scoped>
.info-bar {
	padding: 16rpx 24rpx;
	background: #fff;
}

.step-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	background: #fff;
	border-bottom: 1rpx solid #f0f0f0;

	&__item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	&__dot {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		background: #f0f0f0;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 8rpx;
		transition: all 0.2s;
	}

	&__item--active &__dot {
		background: #18c06a;
		color: #fff;
		box-shadow: 0 0 0 6rpx rgba(24, 192, 106, 0.2);
	}

	&__line {
		position: absolute;
		top: 28rpx;
		left: 60%;
		width: 80%;
		height: 2rpx;
		background: #f0f0f0;
	}
}

.sub-tabs {
	background: #fff;
	padding: 16rpx 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
	white-space: nowrap;

	&__scroll {
		white-space: nowrap;
	}

	&__chip {
		display: inline-block;
		padding: 12rpx 28rpx;
		background: #f5f7fa;
		border-radius: 999rpx;
		margin-right: 16rpx;
	}

	&__chip--active {
		background: #18c06a;
	}
}

.content {
	padding: 0 24rpx 24rpx;
}

.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12rpx 24rpx;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.remark {
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.card-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.check-types {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.lab-group {
	margin-bottom: 24rpx;

	&__head {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding: 12rpx 0;
	}
}

.lab-item {
	&__head {
		display: flex;
		align-items: center;
		gap: 12rpx;
		margin-bottom: 8rpx;
	}

	&__body {
		display: flex;
		align-items: baseline;
		gap: 8rpx;
	}

	&__ref {
		margin-top: 8rpx;
	}
}

.empty,
.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
