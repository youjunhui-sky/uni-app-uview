<template>
	<view class="mgn-patient-container">
		<!-- 顶部导航栏 -->
		<view class="nav-bar">
			<view class="back-btn" @click="goBack">
				<Icon name="mdi:arrow-left" :size="16" color="#333" />
			</view>
			<view class="nav-title">就诊人管理</view>
			<view class="nav-right">
				<Icon name="mdi:dots-vertical" :size="16" color="#333" />
			</view>
		</view>

		<!-- 提示信息 -->
		<view class="tip-message">
			<text>当前账号还可以添加{{ maxPatientCount - patients.length }}张就诊卡。</text>
		</view>

		<!-- 滑动提示 -->
		<view class="slide-tip">
			<Icon name="mdi:arrow-left" :size="12" color="#999" />
			<text>滑动切换就诊卡</text>
			<Icon name="mdi:arrow-right" :size="12" color="#999" />
		</view>

		<!-- 就诊卡展示区域 - 使用原生swiper -->
		<swiper class="patient-swiper" :current="currentPatientIndex" @change="handleChange" circular>
			<swiper-item v-for="(item, index) in patients" :key="index">
				<view class="card-item">
					<image src="/static/banner.png" class="card-bg" mode="aspectFill" />
					<view class="card__info">
						<view class="card__row card__row--name">
							<text class="card__name">{{ item.name }}</text>
						</view>
						<view class="card__row card__row--visit">
							<text class="card__visit-label">档案号：</text>
							<text class="card__visit">{{ item.patientNo }}</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<!-- 增加就诊人按钮 -->
		<up-button
			class="add-btn"
			:customStyle="{ fontSize: '34rpx', height: '110rpx' }"
			:border="false"
			plain
			fill
			:disabled="patients.length >= maxPatientCount"
			@click="addPatient"
		>
			{{ patients.length >= maxPatientCount ? '就诊人已达上限' : '添加就诊人' }}
		</up-button>

		<!-- 底部操作按钮 -->
		<view class="bottom-actions">
			<up-button
				class="edit-btn"
				:customStyle="{ fontSize: '40rpx', height: '110rpx' }"
				:border="false"
				plain
				fill
				@click="editPatient"
			>
				编辑就诊人
			</up-button>
		</view>
	</view>
	<tabbar />
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { ref, computed, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { service } from "@/composables/useService";
import { useStore } from "@/stores";
import { useUserStore } from "@/stores/user";
import Icon from "@/components/icon.vue";

// 定义患者数据类型
interface Patient {
	id: string;
	name: string;
	patientNo: string;
	default: string;
	idCard: string;
	gender: string;
	url: string;
}

// 患者数据
const patients = ref<Patient[]>([]);

// 最大就诊卡数量
const maxPatientCount = ref(5);

const currentPatientIndex = ref(0);

// 当前选中的患者
const currentPatient = computed(() => {
	return patients.value[currentPatientIndex.value];
});

// 加载患者数据
async function loadPatientData() {
	const userStore = useUserStore();
	const userInfo = userStore.info;

	logger.log('userInfo:', userInfo);

	if (!userInfo || Object.keys(userInfo).length === 0) {
		logger.log('用户未登录，跳转到登录页面');
		uni.showToast({
			title: '请先登录',
			icon: 'none',
			duration: 2000,
			complete: () => {
				setTimeout(() => {
					uni.redirectTo({
						url: '/pages/user/login'
					});
				}, 1500);
			}
		});
		return;
	}

	logger.log('开始获取患者数据');
	await service.patient.patientUser.getByUserId({
		userId: userInfo.id
	}).then(res => {
		logger.log('获取患者数据成功:', res);

		if (Array.isArray(res) && res.length > 0) {
			patients.value = res.map((p: any) => ({
				id: String(p.id),
				name: p.name || '未知',
				patientNo: p.patientNo || '',
				default: String(p.default) || '',
				idCard: p.idCard || '',
				gender: p.gender || '',
				url: "/static/banner.png"
			}));
		} else {
			uni.showToast({
				title: '暂无就诊人信息',
				icon: 'none',
				duration: 2000
			});
			patients.value = [];
		}
	}).catch(error => {
		logger.error('获取患者数据失败:', error);
		uni.showToast({
			title: '获取数据失败',
			icon: 'none',
			duration: 2000
		});
	});
}

// 页面首次加载时执行
onMounted(() => {
	loadPatientData();
});

// 页面显示时执行
onShow(() => {
	loadPatientData();
});

// 处理swiper切换
function handleChange(e: any) {
	currentPatientIndex.value = e.detail.current;
	if (patients.value[e.detail.current]) {
		const name = patients.value[e.detail.current].name;

		const { user } = useStore();
		const userStore = useUserStore();
		userStore.set({
			...user.info,
			currentPatient: patients.value[e.detail.current]
		});
	}
}

// 返回上一页
function goBack() {
	uni.navigateBack();
}

// 添加患者
function addPatient() {
	uni.navigateTo({
		url: '/pages/patient/addPatient'
	});
}

// 编辑就诊人
function editPatient() {
	if (currentPatient.value) {
		uni.navigateTo({
			url: `/pages/patient/editPatient?id=${currentPatient.value.id}`
		});
	}
}
</script>

<style scoped>
.mgn-patient-container {
	padding-bottom: 120rpx;
	background-color: #f5f5f5;
}

.nav-bar {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx 40rpx;
	background-color: #fff;
	z-index: 999;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.back-btn,
.nav-right {
	display: flex;
	align-items: center;
}

.nav-title {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
}

.tip-message {
	margin-top: 120rpx;
	padding: 24rpx 40rpx;
	background-color: #fff5e6;
	border-radius: 12rpx;
	margin-bottom: 32rpx;
}

.tip-message text {
	font-size: 28rpx;
	color: #ff6600;
}

.slide-tip {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 32rpx;
}

.slide-tip text {
	font-size: 24rpx;
	color: #999;
	margin: 0 12rpx;
}

.patient-swiper {
	height: 400rpx;
	margin: 0 40rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.card-item {
	width: 100%;
	height: 100%;
	position: relative;
}

.card-bg {
	width: 100%;
	height: 100%;
	border-radius: 24rpx;
}

.card__info {
	position: absolute;
	bottom: 40rpx;
	left: 40rpx;
	right: 40rpx;
	z-index: 1;
}

.card__row {
	margin-bottom: 20rpx;
}

.card__row--name .card__name {
	font-size: 56rpx;
	font-weight: bold;
	color: #333;
	text-shadow: none;
}

.card__row--visit {
	display: flex;
	align-items: center;
}

.card__visit-label {
	font-size: 40rpx;
	color: #666;
	margin-right: 16rpx;
	text-shadow: none;
}

.card__visit {
	font-size: 40rpx;
	color: #333333;
	letter-spacing: 2rpx;
	font-weight: 600;
	text-shadow: none;
}

.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	display: flex;
	background-color: #fff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.edit-btn {
	flex: 1;
	text-align: center;
	padding: 0rpx;
	font-size: 40rpx;
	height: 110rpx;
	border-radius: 0rpx;
	background-color: #1989fa;
	color: #fff;
}

.add-btn {
	position: relative;
	top: 120rpx;
	background-color: #ff4d4f;
	color: #fff;
	border-radius: 0rpx;
}
</style>