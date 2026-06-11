<template>
	<up-loading-page :loading="isLoading" bgColor="#fff">
		<up-card :border="false" :customStyle="{ padding: '20rpx' }">
			<view v-show="simpleInfoFlag">
				<view class="info-row">
					<view class="info-cell">
						<text size="small" color="info" text="姓名：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ patient.name }}</text>
					</view>
					<view class="info-cell">
						<text size="small" color="info" text="性别：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ getDictValue('sex', patient.gender) }}</text>
					</view>
				</view>
			</view>

			<view class="info-row">
				<view class="info-cell" style="width: 35%">
					<text size="small" color="info" text="手机号码：" />
				</view>
				<view class="info-cell">
					<text size="small">{{ patient.mobile }}</text>
				</view>
			</view>

			<view class="info-row">
				<view class="info-cell" style="width: 35%">
					<text size="small" color="info" text="最近就诊时间：" />
				</view>
				<view class="info-cell">
					<text size="small">{{ dateToYMD(patient.lastVisit) }}</text>
				</view>
			</view>

			<view v-show="simpleInfoFlag">
				<view class="info-row">
					<view class="info-cell" style="width: 35%">
						<text size="small" color="info" text="档案号：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ patient.patientNo }}</text>
					</view>
				</view>
			</view>

			<view class="info-row">
				<view class="info-cell" style="width: 35%">
					<text size="small" color="info" text="身份证号：" />
				</view>
				<view class="info-cell">
					<text size="small">{{ patient.idCard }}</text>
				</view>
			</view>

			<view v-show="simpleInfoFlag">
				<view class="info-row">
					<view class="info-cell" style="width: 35%">
						<text size="small" color="info" text="出生日期：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ dateToYMD(patient.birthDate) }}</text>
					</view>
				</view>

				<view class="info-row">
					<view class="info-cell" style="width: 35%">
						<text size="small" color="info" text="籍贯详细地址：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ emptyToStr(patient.nativeProvince) +
                            emptyToStr(patient.nativeCity) +
                            emptyToStr(patient.nativeDistrict) +
                            emptyToStr(patient.nativeAddress) }}</text>
					</view>
				</view>

				<view class="info-row">
					<view class="info-cell" style="width: 35%">
						<text size="small" color="info" text="现住详细地址：" />
					</view>
					<view class="info-cell">
						<text size="small">{{ emptyToStr(patient.currentProvince) +
                            emptyToStr(patient.currentCity) +
                            emptyToStr(patient.currentDistrict) +
                            emptyToStr(patient.currentAddress) }}</text>
					</view>
				</view>
			</view>

			<view class="info-row" style="justify-content: center;">
				<up-button :border="false" size="small" @click="onTap">{{ showAllInfo }}</up-button>
			</view>
		</up-card>
	</up-loading-page>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { onReady } from "@dcloudio/uni-app";
import { ref, watch } from "vue";
import { usePager } from "@/composables/usePager";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { useStore } from "@/stores";
import { useDictStore } from "@/stores/dict";
import { emptyToStr, dateToYMD } from "@/utils/comm";

const dictStore = useDictStore();

const props = defineProps<{
	patient?: any;
	simpleInfoFlag?: boolean;
}>();

const showAllInfo = ref("展开完整信息");
const patient = ref(props.patient || {});
const simpleInfoFlag = ref(props.simpleInfoFlag !== undefined ? props.simpleInfoFlag : true);
const isRefreshing = ref(false);
const hasRefreshed = ref(false);
const isLoading = ref(true);

function getDictValue(dictType: string, dictValue: string) {
	let dictItem = '未知';
	dictStore.get(dictType).forEach(item => {
		if (item.orderNum === Number(dictValue)) {
			dictItem = item.name;
		}
	});
	return dictItem || String(dictValue);
}

function refresh1() {
	if (isRefreshing.value || !patient.value) {
		isLoading.value = false;
		return;
	}

	if (patient.value.id > 0 && (!patient.value.name)) {
		isRefreshing.value = true;
		service.patient.info.info({
			id: patient.value.id
		}).then((res: any) => {
			patient.value = res;
			hasRefreshed.value = true;
		}).catch(error => {
			logger.error("Failed to fetch patient details:", error);
		}).finally(() => {
			isRefreshing.value = false;
			isLoading.value = false;
		});
	} else {
		isLoading.value = false;
	}
}

function onTap() {
	if (simpleInfoFlag.value) {
		simpleInfoFlag.value = false;
	} else {
		simpleInfoFlag.value = true;
	}
	showAllInfo.value = simpleInfoFlag.value ? "收起完整信息" : "展开完整信息";
}
</script>

<style lang="scss" scoped>
.info-row {
	display: flex;
	flex-wrap: wrap;
	margin-bottom: 16rpx;
}

.info-cell {
	flex: 1;
	display: flex;
	align-items: center;
}
</style>