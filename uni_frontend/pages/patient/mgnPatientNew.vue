<template>
	<page-wrapper background-color="#fff">
		<view class="container">
			<!-- 顶部添加按钮 -->
			<view class="add-btn" @tap="goAdd">
				<text class="plus">+</text>
				<text class="add-text">添加就诊人</text>
			</view>

			<!-- 空状态卡片 -->
			<view v-if="!loading && patients.length === 0" class="empty-card">
				<text class="empty-text">暂无就诊人</text>
			</view>

			<!-- 列表卡片 -->
			<view v-for="item in patients" :key="item.id" class="patient-card">
				<!-- 头部：姓名 / 性别年龄 / 编辑 -->
				<view class="card-header">
					<text class="name">{{ item.name }}</text>
					<text class="meta"
						>{{ genderText(item.gender) || calcGenderByIdCard(item.idCard) }}
						{{ item.age }}岁</text
					>
					<view class="edit" @tap="edit(item)">
						<Icon name="mdi:pencil" :size="14" color="#666" />
					</view>
				</view>

				<!-- 上区域：档案号 / 证件号 / 手机号 -->
				<view class="info-row">
					<text class="label">就诊卡号：</text>
					<text class="value">{{ item.patientNo || "-" }}</text>
				</view>
				<view class="info-row">
					<text class="label">证 件 号：</text>
					<text class="value">{{ maskIdCard(item.idCard) }}</text>
				</view>
				<view class="info-row">
					<text class="label">手机号码：</text>
					<text class="value">{{ maskMobile(item.mobile) }}</text>
				</view>

				<view class="divider" />

				<!-- 底部操作区：设为当前就诊人 / 删除 -->
				<view class="bottom-row">
					<view class="set-current" @tap="setCurrent(item)">
						<view :class="['dot', currentId === item.id ? 'active' : '']"></view>
						<text class="bottom-text">设为当前就诊人</text>
					</view>
					<text class="delete" @tap="remove(item)">删除</text>
				</view>
			</view>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { ref, onMounted } from "vue";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";
import Icon from "@/components/icon.vue";
import { useUserStore } from "@/stores/user";
import { onShow } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";

interface PatientItem {
	id: string;
	name: string;
	patientNo?: string;
	idCard?: string;
	mobile?: string;
	gender?: string | number;
	age?: number;
	patientId?: number;
}

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const patients = ref<PatientItem[]>([]);
const currentId = ref<string>("");

onShow(async () => {
	loading.value = true;
	await loadPatients();
	loading.value = false;
});

async function loadPatients() {
	const userInfo = userStore.info;
	if (!userInfo?.id) {
		return;
	}
	try {
		const res = await service.patient.patientUser.getByUserId({ userId: userInfo.id });
		logger.log("获取就诊人数据成功:", res);
		const list = Array.isArray(res) ? res : [];
		patients.value = list.map((p: any) => ({
			id: String(p.id),
			name: p.name || "未知",
			patientNo: p.patientNo || "",
			idCard: p.idCard || "",
			mobile: p.mobile || "",
			gender: p.gender || "",
			age: calcAgeByIdCard(p.idCard),
			patientId: p.patientId || 0,
		}));
		// 默认就诊人
		const def = list.find((x: any) => String(x.default) === "1");
		currentId.value = def ? String(def.id) : "";

		// 重制当前默认就诊人
		storage.set("currentPatient", def);

	} catch (e) {
		showTips("获取就诊人失败");
		patients.value = [];
	}
}

function goAdd() {
	router.push("/pages/patient/addPatientNew");
}

function edit(item: PatientItem) {
	logger.log("item", item);
	router.push({
		path: "/pages/patient/updatePatient",
		params: { patientNo: item.patientNo, patientId: item.patientId },
	});
}

function setCurrent(item: PatientItem) {
	const currentPatient = patients.value.find((x) => x.id === item.id);
	if(!currentPatient){
		showTips("就诊人不存在");
		return;
	}
	logger.log("设置当前就诊人:", {
		userId: userStore.info?.id,
		patientUserId: currentPatient.patientNo,
	});
	service.patient.patientUser
		.updateDefault({
			userId: userStore.info?.id,
			patientNo: currentPatient.patientNo,
		})
		.then((res: any) => {
			logger.log("updateDefault response:", res);
			showTips("已设为当前就诊人");
			// 更新当前就诊人ID
			currentId.value = item.id;
			storage.set("currentPatient", currentPatient);
			loadPatients();
		})
		.catch((err: any) => {
			logger.error("设置当前就诊人失败:", err);
			showTips("设置失败");
		});
}

function remove(item: PatientItem) {
	uni.showModal({
		title: "",
		content: `确认删除 ${item.name} 吗？`,
		confirmText: "删除",
		confirmColor: "#151515",
		cancelText: "取消",
		success: async (res) => {
			if (res.confirm) {
				try {
					// 删除前先记一下：被删的这个人是不是"当前默认"
					const wasDefault = currentId.value === item.id;
					const deletedPatientNo = item.patientNo;

					await service.patient.patientUser.delete({
						ids: [item.id],
					});
					showTips("删除成功");
					await loadPatients();

					logger.log("wasDefault = " + wasDefault + ", deletedPatientNo = " + deletedPatientNo);

					// 只有"删的就是默认 + 还有别的就诊人"才需要自动晋升
					if (wasDefault && patients.value.length > 0) {
						const noDefPatient = patients.value[0];
						logger.log("noDefPatient = " + noDefPatient.name);
						// 后端 updateDefault 期望 patientNo（档案号），与 tpatient_user.id 不同
						await service.patient.patientUser
							.updateDefault({
								userId: userStore.info?.id,
								patientNo: noDefPatient.patientNo,
							})
							.then(() => {
								storage.set("currentPatient", noDefPatient);
								loadPatients();
							})
							.catch((err: any) => {
								logger.error("自动设置新默认就诊人失败:", err);
							});
					} else if (patients.value.length === 0) {
						// 删光了，清空缓存里的当前就诊人
						storage.remove("currentPatient");
					}
				} catch (e) {
					showTips("删除失败");
				}
			}
		},
	});
}

function showTips(message: string) {
	uni.showModal({
		title: "",
		content: message,
		showCancel: false,
		confirmText: "知道了",
		confirmColor: "#151515",
	});
}

function genderText(g: any) {
	const v = String(g || "");
	if (v === "1" || v === "男") return "男";
	if (v === "2" || v === "女") return "女";
	return "";
}

function calcGenderByIdCard(idCard?: string) {
	if (!idCard || idCard.length < 18) return undefined;
	const v = Number(idCard.substring(16, 17));
	return v % 2 === 0 ? "女" : "男";
}

function calcAgeByIdCard(idCard?: string) {
	if (!idCard || idCard.length < 18) return undefined;
	const y = Number(idCard.substring(6, 10));
	const m = Number(idCard.substring(10, 12)) - 1;
	const d = Number(idCard.substring(12, 14));
	const birth = new Date(y, m, d);
	const now = new Date();
	let age = now.getFullYear() - birth.getFullYear();
	const hasBirthday =
		now.getMonth() > birth.getMonth() ||
		(now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());
	return hasBirthday ? age : age - 1;
}

function maskIdCard(val?: string) {
	if (!val) return "";
	return val.replace(/(\d{4})\d+(\w{4})/, "$1********$2");
}

function maskMobile(val?: string) {
	if (!val) return "";
	return val.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}
</script>

<style lang="scss" scoped>
.container {
	padding: 24rpx;
}

.add-btn {
	height: 88rpx;
	border-radius: 16rpx;
	background: linear-gradient(90deg, #17d1a3 0%, #44e28f 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;
}
.plus {
	color: #fff;
	font-size: 36rpx;
	margin-right: 12rpx;
}
.add-text {
	color: #fff;
	font-size: 32rpx;
}

.patient-card {
	background: #e9faf4;
	border-radius: 16rpx;
	box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.05);
	padding: 24rpx;
	margin-bottom: 20rpx;
}

.card-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.name {
	font-weight: bold;
	font-size: 32rpx;
	color: #151515;
}
.meta {
	font-size: 26rpx;
	color: #666;
	margin-left: 12rpx;
}
.edit {
	margin-left: auto;
}

.info-row {
	display: flex;
	align-items: center;
	margin-top: 18rpx;
}
.label {
	color: #999;
	font-size: 26rpx;
	width: 220rpx;
}
.value {
	color: #16d0a7;
	font-size: 28rpx;
}

.divider {
	height: 1rpx;
	background: #dfeee8;
	margin: 22rpx 0;
}

.bottom-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.set-current {
	display: flex;
	align-items: center;
}
.dot {
	width: 28rpx;
	height: 28rpx;
	border-radius: 50%;
	border: 2rpx solid #d0d0d0;
	margin-right: 12rpx;
}
.dot.active {
	border-color: #16d0a7;
	background: #16d0a7;
}
.bottom-text {
	font-size: 26rpx;
	color: #151515;
}
.delete {
	font-size: 26rpx;
	color: #999;
}

.empty-card {
	background: #f7f8fa;
	border-radius: 16rpx;
	padding: 40rpx;
	text-align: center;
}
.empty-text {
	color: #999;
	font-size: 28rpx;
}
</style>