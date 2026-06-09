<template>
	<page-wrapper>
		<!-- 头部：医院名称 + 右侧图标 -->
		<view class="home-header">
			<view class="home-header__left">
				<image class="home-header__logo" src="/static/logo.png" mode="widthFix"></image>
				<text class="home-header__title">{{ hospitalName }}</text>
			</view>
		</view>

		<!-- Banner -->
		<image class="home-banner" src="/static/banner.png" mode="aspectFill"></image>

		<!-- 两个主功能卡片 -->
		<view class="home-main-cards">
			<view class="main-card main-card--yellow" @tap="goOnlineConsult">
				<view class="main-card__title">{{ t("诊前问询") }}</view>
				<view class="main-card__sub">{{ t("") }}</view>
			</view>
			<view class="main-card main-card--green" @tap="goFreeQA">
				<view class="main-card__title">{{ t("查看报告") }}</view>
				<view class="main-card__sub">{{ t("") }}</view>
			</view>
		</view>

		<!-- 患者选择弹窗 -->
		<up-popup :show="visible" mode="bottom" @close="visible = false">
			<view v-for="p in patients" :key="p.id" class="patient-item" @click="selectPatient(p)">
				<text :size="36" :bold="p.id === currentPatient?.id">
					{{ p.name }}
					{{
						p.idCard
							? p.idCard.substring(0, 6) +
								"*".repeat(p.idCard.length - 10) +
								p.idCard.substring(p.idCard.length - 4)
							: ""
					}}
				</text>
			</view>
		</up-popup>

		<tabbar />
	</page-wrapper>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import Tabbar from "./components/tabbar.vue";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { storage } from "@/composables/useStorage";
import { useRouter } from "@/composables/useRouter";
import { getHospitalName } from "@/utils/comm";
import pageWrapper from "@/components/page-wrapper.vue";

const { t } = useI18n();

const router = useRouter();

const hospitalName = ref<string>("");

const userStore = useUserStore();

const visible = ref(false);

const patientList = ref<any[]>([]);

interface Patient {
	id: string;
	name: string;
	patientNo: string;
	default: string;
	idCard: string;
	gender: string;
}

const isMgnPatient = ref(false);
const isLogin = ref(false);
const currentPatient = ref<Patient | null>(null);
const patients = ref<Patient[]>([]);

onMounted(async () => {
	hospitalName.value = await getHospitalName();
	checkMgnPatient();
	checkLogin();
});

function checkLogin() {
	const userInfo = userStore.info;
	console.log("检查登录状态 - userInfo:", userInfo);
	if (userInfo === null || userInfo === undefined) {
		isLogin.value = false;
		return;
	} else {
		isLogin.value = userInfo?.token !== null;
	}
}

function checkMgnPatient() {
	const currentPatientStorage = storage.get("currentPatient");
	if (currentPatientStorage) {
		currentPatient.value = {
			id: String(currentPatientStorage.id),
			name: currentPatientStorage.name || "",
			patientNo: currentPatientStorage.patientNo || "",
			default: String(currentPatientStorage.default || ""),
			idCard: currentPatientStorage.idCard || "",
			gender: currentPatientStorage.gender || "",
		};
	} else {
		currentPatient.value = null;
	}
	isMgnPatient.value = currentPatientStorage !== null && currentPatientStorage !== undefined;
}

function login() {
	uni.navigateTo({
		url: "/pages/user/login",
	});
}

async function changePatient() {
	if (patients.value.length === 0) {
		await loadPatientData();
	}
	if (patients.value.length === 1) {
		visible.value = false;
		console.log("只有一个就诊人，无需选择");
		return;
	}
	visible.value = !visible.value;
}

async function loadPatientData() {
	const userStore = useUserStore();
	const userInfo = userStore.info;
	console.log("开始获取患者数据");
	await service.patient.patientUser
		.getByUserId({
			userId: userInfo?.id || "",
		})
		.then((res) => {
			if (Array.isArray(res) && res.length > 0) {
				console.log("患者数据:", res);
				patients.value = res.map((p: any) => ({
					id: String(p.id),
					name: p.name || "未知",
					patientNo: p.patientNo || "",
					default: String(p.default) || "",
					idCard: p.idCard || "",
					gender: p.gender || "",
				}));
				return patients.value.length;
			} else {
				uni.showToast({
					title: "暂无就诊人信息",
					icon: "none",
					duration: 2000,
				});
				patients.value = [];
				return patients.value.length;
			}
		})
		.catch((error) => {
			console.error("获取患者数据失败:", error);
		});
}

function selectPatient(p: Patient) {
	currentPatient.value = p;

	const userStore = useUserStore();
	const userInfo = userStore.info;

	if (userInfo) {
		storage.set("currentPatient", p);
	}
	visible.value = false;
}

function onSearch() {}

function goOnlineConsult() {
	router.push({
		path: "/pages/questionnaire/index",
	});
}

function goFreeQA() {
	router.push({
		path: "/pages/report/index",
	});
}

function addPatient() {
	router.push({
		path: "/pages/patient/addPatientNew",
	});
}

function goPay() {}

function goReport() {}

function goPrescription() {}

const depts = reactive([
	{ id: 1, name: t("产科") },
	{ id: 2, name: t("妇科") },
	{ id: 3, name: t("儿科") },
]);

function openDept(d: { id: number; name: string }) {}

function moreDept() {}
</script>

<style lang="scss" scoped>
.home-header {
	padding: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;

	&__left {
		display: flex;
		align-items: center;
	}

	&__logo {
		width: 40rpx;
		height: 40rpx;
		margin-right: 12rpx;
		border-radius: 50%;
	}

	&__title {
		font-size: 32rpx;
		font-weight: 700;
	}

	&__right text {
		font-size: 36rpx;
		margin-left: 24rpx;
	}
}

.home-banner {
	margin: 0 24rpx;
	height: 360rpx;
	width: calc(100% - 48rpx);
	border-radius: 16rpx;
	object-fit: cover;
	box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.06);
	margin-bottom: 24rpx;
}

.home-main-cards {
	display: flex;
	padding: 0 24rpx;
	justify-content: space-between;
	margin-bottom: 24rpx;

	.main-card {
		flex: 1;
		border-radius: 20rpx;
		padding: 28rpx;
		color: #fff;
		box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.06);

		&__title {
			font-size: 32rpx;
			font-weight: 700;
		}

		&__sub {
			font-size: 22rpx;
			opacity: 0.9;
			margin-top: 10rpx;
		}
	}

	.main-card--yellow {
		background: linear-gradient(135deg, #ffd77a, #ffb64d);
		margin-right: 16rpx;
	}

	.main-card--green {
		background: linear-gradient(135deg, #43e397, #18c06a);
		margin-left: 16rpx;
	}
}

.home-add {
	margin: 0 24rpx 24rpx;
	background: #f0fbf9;
	border-radius: 20rpx;
	padding: 32rpx 24rpx;
	text-align: center;
	box-shadow: inset 0 0 0 1rpx rgba(0, 0, 0, 0.04);

	&__btn {
		color: #fff;
		background: linear-gradient(135deg, #0fd6c8, #10c0a8);
		border-radius: 9999rpx;
		padding: 18rpx 0;
		font-size: 28rpx;
		margin-top: 16rpx;
	}

	&__tip {
		color: #666;
		font-size: 24rpx;
		margin: 0;
	}
}

.patient-info-container {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}

.change-patient-btn {
	color: #0fd6c8;
	font-size: 24rpx;
	cursor: pointer;
	position: absolute;
	right: 24rpx;
}

.patient-item {
	font-size: 36rpx;
	font-weight: 700;
	align-items: center;
	margin-bottom: 16rpx;
	border-bottom: 3rpx solid #f0f0f0;
}

.home-section {
	margin: 0 24rpx 24rpx;
	background: #fff;
	border-radius: 20rpx;
	padding: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);

	&__title {
		font-size: 32rpx;
		font-weight: 700;
		margin-bottom: 16rpx;
	}
}

.home-service {
	display: flex;
	justify-content: space-between;

	.service-item {
		width: 30%;
		text-align: center;
	}

	.service-item__icon {
		width: 96rpx;
		height: 96rpx;
		margin: 0 auto 8rpx;
	}

	.service-item__text {
		font-size: 26rpx;
	}
}

.home-dept {
	display: flex;
	align-items: center;
	flex-wrap: wrap;

	.dept-item {
		width: 20%;
		text-align: center;
		margin-bottom: 24rpx;
	}

	.dept-item__icon {
		width: 80rpx;
		height: 80rpx;
		background: #eaf5ff;
		border-radius: 50%;
		margin: 0 auto 8rpx;
	}

	.dept-item__text {
		font-size: 24rpx;
	}

	.dept-more {
		margin-left: auto;
		color: #999;
		font-size: 26rpx;
	}
}
</style>