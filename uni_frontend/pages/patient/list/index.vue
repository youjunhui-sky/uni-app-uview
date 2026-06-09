<template>
	<page-wrapper>
		<!-- 搜索栏 -->
		<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
			<view style="display: flex; gap: 20rpx;">
				<up-search
					v-model="searchValue"
					placeholder="请输入姓名进行搜索"
					@search="handleSearch"
					:customStyle="{ flex: 1 }"
				/>
			</view>
		</up-card>

		<!-- 患者列表 -->
		<view class="patient-list">
			<view v-for="(patient, index) in patientList" :key="index" class="patient-card">
				<!-- 姓名（可点击） -->
				<view class="card-header" @click="toggleItemDetail(patient)">
					<text :size="32" class="patient-name">{{ patient.name }}</text>
					<Icon :name="expandedItems[patient.id] ? 'mdi:arrow-down' : 'mdi:arrow-right'" :size="12" color="#999" />
				</view>

				<!-- 基本信息 -->
				<view class="card-content">
					<view class="info-row">
						<text size="small" color="info" text="档案号：" />
						<text size="small">{{ patient.patientNo }}</text>
						<text size="small" color="#999" :customStyle="{ margin: '0 20rpx' }" text="|" />
						<text size="small" color="info" text="碎石号：" />
						<text size="small">{{ patient.patientNo }}</text>
					</view>

					<!-- 可点击链接 -->
					<view class="links-row">
						<text size="small" color="#3c9cff" class="link" @click.stop="viewPreoperativeRecord(patient)" text="术前病历" />
						<text size="small" color="#999" :customStyle="{ margin: '0 20rpx' }" text="|" />
						<text size="small" color="#3c9cff" class="link" @click.stop="viewTreatmentRecord(patient)" text="治疗记录" />
					</view>

					<!-- 展开客户详情 -->
					<view v-if="expandedItems[patient.id]" class="expanded-detail">
						<PatientInfo :patient="patient" :simpleInfoFlag="false" />
					</view>
				</view>
			</view>
		</view>

		<!-- 加载更多 -->
		<up-loadmore :status="loading ? 'loading' : 'loadmore'" :divider="false" />

		<tabbar />
	</page-wrapper>
</template>

<script lang="ts" setup>
import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
import { usePager } from "@/composables/usePager";
import { service } from "@/composables/useService";
import PatientInfo from "../info/index.vue";
import Tabbar from "../../index/components/tabbar.vue";
import pageWrapper from "@/components/page-wrapper.vue";
import Icon from "@/components/icon.vue";

const searchValue = ref("");
const expandedItems = ref<{ [key: number]: boolean }>({});
const loading = ref(false);
const isFirstLoad = ref(false);
const patientList = ref<any[]>([]);

const { onRefresh, onData } = usePager();

function refresh(params?: any) {
	const keyword = searchValue.value.toLowerCase();
	if (params == null || isFirstLoad.value) {
		params = { page: 1, size: 20 };
	}
	isFirstLoad.value = false;
	params.name = keyword;
	const { data, next } = onRefresh(params);
	onData((list) => {
		if (data.page == 1) {
			Object.keys(expandedItems.value).forEach(key => {
				expandedItems.value[parseInt(key)] = false;
			});
			patientList.value = list;
		} else {
			patientList.value = [...patientList.value, ...list];
		}
	});
	loading.value = true;
	return next(service.patient.info.page(data));
}

onReady(() => {
	refresh();
});

function handleSearch() {
	Object.keys(expandedItems.value).forEach(key => {
		expandedItems.value[parseInt(key)] = false;
	});
	patientList.value = [];
	isFirstLoad.value = true;
	refresh();
}

function toggleItemDetail(item: { id: number; }) {
	expandedItems.value[item.id] = !expandedItems.value[item.id];
}

function viewPreoperativeRecord(patient: any) {
	console.log("viewPreoperativeRecord", patient);
}

function viewTreatmentRecord(patient: any) {
	console.log("viewTreatmentRecord", patient);
}

defineExpose({
	refresh,
});
</script>

<style lang="scss" scoped>
.patient-list {
	padding: 0 20rpx;
}

.patient-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 20rpx;
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
}

.patient-name {
	font-weight: bold;
}

.card-content {
	.info-row {
		display: flex;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.links-row {
		display: flex;
		align-items: center;
		margin-top: 12rpx;
	}

	.link {
		cursor: pointer;
	}
}

.expanded-detail {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;
}
</style>