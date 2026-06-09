<template>
	<page-wrapper>
		<!-- #ifdef MP -->
		<up-sticky>
			<up-navbar :showBack="false" :border="false" :bgColor="'transparent'" />
		</up-sticky>
		<!-- #endif -->

		<view class="page-my">
			<view class="second">
				<view v-if="second_flag" class="card">
					<view class="card__top">
						<view class="card__title">
							<image
								class="card__logo"
								src="/static/logo.png"
								mode="widthFix"
							></image>
							<view class="card__hospital">{{ hospitalName }}</view>
						</view>
						<view class="card__action" @tap="switchPatient">切换就诊人</view>
					</view>

					<view class="card__info">
						<view class="card__info-left">
							<view class="card__row card__row--name">
								<text class="card__name">{{ patientCard.patientName }}</text>
							</view>
							<view class="card__row card__row--no">
								<text class="card__no">{{ patientCard.maskedCardNo }}</text>
							</view>
							<view class="card__row card__row--visit">
								<text class="card__visit-label">档案号：</text>
								<text class="card__visit">{{ patientCard.visitNo }}</text>
							</view>
						</view>
						<view class="card__info-right">
							<image
								v-if="qrCodeImage"
								class="card__qrcode"
								:src="qrCodeImage"
								mode="aspectFit"
								@error="handleQRCodeError"
							></image>
							<view v-else class="card__qrcode-placeholder">加载中...</view>
						</view>
					</view>
				</view>

				<view
					v-else
					class="card-empty"
					style="
						background: #ebeff5;
						color: #151515;
						border-radius: 24rpx;
						margin: 24rpx 0;
					"
				>
					<view class="card__top">
						<view class="card__title">
							<image
								class="card__logo"
								src="/static/logo.png"
								mode="widthFix"
							></image>
							<view class="card__hospital">{{ hospitalName }}</view>
						</view>
					</view>

					<view class="empty__content">
						<up-button
							@tap="chooseRecord"
							:customStyle="{
								background: '#f1583c',
								borderColor: '#f1583c',
								color: '#ffffff',
								borderRadius: '16rpx',
								boxShadow: '0 12rpx 24rpx rgba(241, 88, 60, 0.35)',
								height: '88rpx',
								lineHeight: '88rpx',
								padding: '0 48rpx',
								fontSize: '30rpx'
							}"
						>
							选择就诊人 >
						</up-button>
						<text
							class="empty__tip"
							style="color: #9aa3ae; font-size: 24rpx; text-align: center"
							>未选择就诊人，将无法为您提供更多的服务</text
						>
					</view>
				</view>
			</view>

			<view class="status">
				<up-text block size="large" bold text="基本信息" />

				<view class="list">
					<view class="item" @tap="toEdit">
						<image
							src="/static/grxx.png"
							mode="widthFix"
							:style="{ width: '50rpx', height: '50rpx' }"
						>
						</image>
						<text style="margin-top: 18rpx; font-size: 24rpx; color: #909399">个人信息</text>
					</view>
				</view>
			</view>

			<view class="status">
				<up-text block size="large" bold text="设置" />

				<view class="list">
					<view class="item" @tap="toSet">
						<image
							src="/static/set.png"
							mode="widthFix"
							:style="{ width: '50rpx', height: '50rpx' }"
						>
						</image>
						<text style="margin-top: 18rpx; font-size: 24rpx; color: #909399">设置</text>
					</view>
					<view
						class="item"
						@tap="
							router.push({
								path: '/pages/user/doc',
								query: {
									key: 'userAgreement',
									title: '用户协议',
								},
							})
						"
					>
						<image
							src="/static/yhxy.png"
							mode="widthFix"
							:style="{ width: '50rpx', height: '50rpx' }"
						>
						</image>
						<text style="margin-top: 18rpx; font-size: 24rpx; color: #909399">用户协议</text>
					</view>
					<view
						class="item"
						@tap="
							router.push({
								path: '/pages/user/doc',
								query: {
									key: 'privacyPolicy',
									title: '隐私政策',
								},
							})
						"
					>
						<image
							src="/static/yszc.png"
							mode="widthFix"
							:style="{ width: '50rpx', height: '50rpx' }"
						>
						</image>
						<text style="margin-top: 18rpx; font-size: 24rpx; color: #909399">隐私政策</text>
					</view>
				</view>
			</view>
		</view>

		<tabbar />

		<!-- 隐藏的canvas用于生成二维码（非H5平台） -->
		<!-- #ifndef H5 -->
		<!-- #ifdef MP-WEIXIN -->
		<canvas
			type="2d"
			id="qrcode-canvas"
			style="position: fixed; top: -9999px; left: -9999px; width: 200px; height: 200px"
		></canvas>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<canvas
			canvas-id="qrcode-canvas"
			id="qrcode-canvas"
			style="position: fixed; top: -9999px; left: -9999px; width: 200px; height: 200px"
		></canvas>
		<!-- #endif -->
		<!-- #endif -->
	</page-wrapper>
</template>

<script lang="ts" setup>
import { onPullDownRefresh, onShow } from "@dcloudio/uni-app";
import { service } from "@/composables/useService";
import { storage } from "@/composables/useStorage";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { useDictStore } from "@/stores/dict";
import { useUi } from "@/composables/useUi";
import { reactive, ref } from "vue";
import Tabbar from "./components/tabbar.vue";
import { getHospitalName } from "@/utils/comm";
import { generateQRCode } from "@/utils/qrcode";
import pageWrapper from "@/components/page-wrapper.vue";

const router = useRouter();
const userStore = useUserStore();
const { dict } = useDictStore();

const hospitalName = ref("");

const patientCard = reactive({
	hospitalName: "",
	patientName: "",
	maskedCardNo: "",
	visitNo: "",
});

const second_flag = ref(false);
const qrCodeImage = ref("");

async function refresh() {
	hospitalName.value = await getHospitalName();

	if (userStore.token) {
		await userStore.get();
	} else {
		userStore.logout();
	}

	let currentPatientStorage = storage.get("currentPatient");
	console.log("currentPatientStorage" + currentPatientStorage);

	if (currentPatientStorage && typeof currentPatientStorage === 'object' && !Array.isArray(currentPatientStorage) && Object.keys(currentPatientStorage).length > 0) {
		second_flag.value = true;
	}else{
		await service.patient.patientUser.getCurrentPatient({userId: userStore.info?.id}).then((res) =>{
			if (!res || typeof res !== 'object' || Array.isArray(res) || Object.keys(res).length === 0) {

			}else{
				currentPatientStorage = res;
				storage.set("currentPatient" , res);
				second_flag.value = true;
			}
		});
	}

	patientCard.patientName = currentPatientStorage?.name || "";
	patientCard.maskedCardNo = maskIdCard(currentPatientStorage?.idCard || "");
	patientCard.visitNo = currentPatientStorage?.patientNo || "";

	if (second_flag.value && patientCard.visitNo) {
		try {
			const visitNoStr = String(patientCard.visitNo);
			console.log("开始生成二维码，内容:", visitNoStr, "长度:", visitNoStr.length);

			if (visitNoStr.length > 2000) {
				console.warn("档案号过长，截取前2000个字符");
				const qrCode = await generateQRCode(visitNoStr);
				qrCodeImage.value = qrCode;
			} else {
				const qrCode = await generateQRCode(visitNoStr);
				console.log("二维码生成成功，类型:", typeof qrCode, "长度:", qrCode?.length);
				if (qrCode && qrCode.length > 0) {
					qrCodeImage.value = qrCode;
				} else {
					console.warn("二维码数据为空");
					qrCodeImage.value = "";
				}
			}
		} catch (error: any) {
			console.error("生成二维码失败:", error);
			console.error("错误详情:", error.message);
			qrCodeImage.value = "";
		}
	} else {
		qrCodeImage.value = "";
	}
}

function maskIdCard(val?: string) {
	if (!val) return "";
	return val.replace(/(\d{4})\d+(\w{4})/, "$1********$2");
}

function handleQRCodeError(e: any) {
	console.error("二维码图片加载失败:", e);
	qrCodeImage.value = "";
}

function switchPatient() {
	second_flag.value = false;
	router.push({
		path: "/pages/patient/mgnPatientNew",
	});
}

function mgnPatient() {
	router.push({
		path: "/pages/patient/mgnPatientNew",
	});
}

function chooseRecord() {
	router.push({
		path: "/pages/patient/mgnPatientNew",
	});
}

function toSet() {
	router.push("/pages/user/set");
}

function toEdit() {
	router.push("/pages/user/edit");
}

onPullDownRefresh(async () => {
	await refresh();
	uni.stopPullDownRefresh();
});

onShow(() => {
	refresh();
});
</script>

<style lang="scss" scoped>
$gap: 24rpx;

.page-my {
	padding: $gap;

	.header {
		display: flex;

		.icon {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 60rpx;
			width: 60rpx;
			background-color: rgba(150, 150, 150, 0.1);
			border-radius: 16rpx;
			font-size: 32rpx;
			margin-right: $gap;

			&:last-child {
				margin-left: auto;
				margin-right: 0;
			}
		}
	}

	.user {
		display: flex;
		align-items: center;
		padding: 48rpx 12rpx;

		.det {
			flex: 1;
			margin-left: 32rpx;
		}
	}

	.count {
		display: flex;
		margin-bottom: 32rpx;

		.item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			flex: 1;

			text {
				&:nth-child(1) {
					font-size: 40rpx;
					margin-bottom: 4rpx;
					font-weight: bold;
				}

				&:nth-child(2) {
					font-size: 24rpx;
					color: $u-info;
				}
			}
		}
	}

	.switch {
		display: flex;
		margin-bottom: 24rpx;

		.item {
			flex: 1;
			border-radius: 24rpx;
			padding: 32rpx;
			background-color: #fff;
			position: relative;

			.inner {
				position: absolute;
				right: 24rpx;
				top: calc(50% - 30rpx);
				transform: scale(0.8);
			}

			&:nth-child(1) {
				margin-right: 12rpx;
			}

			&:nth-child(2) {
				margin-left: 12rpx;
			}
		}
	}

	.second {
		.card {
			background: linear-gradient(135deg, #78d3ff 0%, #6fb2ff 40%, #6fa9ff 100%);
			border-radius: 24rpx;
			padding: 32rpx;
			box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.08);
			color: #ffffff;
			border-radius: 24rpx;
			margin-bottom: 24rpx;
			height: 160px;
		}
		.card-empty {
			background-color: #bcc2cb;
			border-radius: 24rpx;
			padding: 32rpx;
			box-shadow: 0 12rpx 24rpx rgba(0, 0, 0, 0.08);
			color: #ffffff;
			border-radius: 24rpx;
			margin-bottom: 24rpx;
			height: 160px;
		}

		.card__top {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.card__title {
			display: flex;
			align-items: center;
		}

		.card__logo {
			width: 56rpx;
			height: 56rpx;
			margin-right: 16rpx;
			border-radius: 50%;
			background: rgba(255, 255, 255, 0.25);
		}

		.card__hospital {
			font-size: 26rpx;
			font-weight: 600;
			line-height: 1.3;
			max-width: 480rpx;
		}

		.card__action {
			background: rgba(255, 255, 255, 0.9);
			color: #3366ff;
			padding: 8rpx 18rpx;
			border-radius: 9999rpx;
			font-size: 22rpx;
		}

		.card__info {
			margin-top: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
		}

		.card__info-left {
			flex: 1;
		}

		.card__info-right {
			margin-left: 24rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.card__qrcode {
			width: 120rpx;
			height: 120rpx;
			background-color: rgba(255, 255, 255, 0.9);
			border-radius: 8rpx;
			padding: 8rpx;
			display: block;
		}

		.card__qrcode-placeholder {
			width: 120rpx;
			height: 120rpx;
			background-color: rgba(255, 255, 255, 0.3);
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 20rpx;
			color: rgba(255, 255, 255, 0.8);
		}

		.empty__content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			margin-top: 36rpx;
		}

		.empty__tip {
			margin-top: 16rpx;
			font-size: 22rpx;
			opacity: 0.95;
		}

		.card__row {
			display: flex;
			align-items: center;
		}

		.card__row--name {
			margin-bottom: 12rpx;
		}

		.card__name {
			font-size: 36rpx;
			font-weight: 700;
			margin-right: 12rpx;
		}

		.card__tag {
			font-size: 20rpx;
			padding: 6rpx 12rpx;
			border-radius: 8rpx;
			background: rgba(255, 255, 255, 0.25);
		}

		.card__no {
			font-size: 28rpx;
			letter-spacing: 2rpx;
			margin: 8rpx 0 10rpx 0;
			opacity: 0.95;
		}

		.card__visit-label {
			font-size: 22rpx;
			opacity: 0.9;
		}

		.card__visit {
			font-size: 26rpx;
			margin-left: 6rpx;
			font-weight: 600;
		}
	}

	.status {
		background-color: #fff;
		border-radius: 24rpx;
		padding: 32rpx;
		margin-bottom: 24rpx;

		.list {
			display: flex;
			flex-wrap: wrap;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				width: 25%;
				padding: 48rpx 0 24rpx 0;
			}
		}
	}
}
</style>