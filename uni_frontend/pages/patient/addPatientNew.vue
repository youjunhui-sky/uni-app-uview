<template>
	<page-wrapper background-color="#fff">
		<view class="wrapper">
			<!-- 个人信息 -->
			<up-card :border="false" :customStyle="{ marginBottom: '24rpx' }">
				<template #head>
					<up-text bold size="large" text="个人信息" />
				</template>
				<template #body>
					<view class="form-item">
						<view class="form-row">
							<label class="label">姓名<text class="required">*</text></label>
							<up-input
								v-model="form.name"
								:maxlength="30"
								placeholder="请输入姓名"
								:border="'surround'"
								@blur="syncPatient"
							/>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">身份证号码<text class="required">*</text></label>
							<up-input
								v-model="form.idCard"
								type="text"
								:maxlength="18"
								placeholder="请输入18位身份证号码"
								:border="'surround'"
								@blur="syncPatient"
							/>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">手机号<text class="required">*</text></label>
							<up-input
								v-model="form.mobile"
								type="tel"
								:maxlength="11"
								placeholder="请输入手机号码"
								:border="'surround'"
							/>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">职业</label>
							<single-select
								v-model="form.occupation"
								:options="dutyOptions"
								placeholder="请选择职业"
								class="select"
							/>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">默认就诊人</label>
							<up-switch
								v-model="form.default"
								:activeValue="1"
								:activeColor="'#00c38a'"
								:inactiveValue="0"
							/>
						</view>
					</view>
				</template>
			</up-card>

			<!-- 温馨提示 -->
			<up-card :border="false">
				<template #head>
					<up-text bold size="large" text="温馨提示" />
				</template>
				<template #body>
					<view class="tips">
						<view>1. 请如实填写个人信息，若已在该医院建档，则会自动绑定医院就诊卡。</view>
						<view>2. 未成年人身份证如尚未办理可不填写，证件类型请选择其他，并需填写监护人信息。</view>
					</view>
				</template>
			</up-card>

			<!-- 协议与提交 -->
			<up-card :border="false">
				<template #body>
					<up-button
						class="submit-btn"
						type="primary"
						fill
						:border="false"
						:customStyle="{ height: '90rpx', fontSize: '32rpx', background: '#00c38a' }"
						:loading="saving"
						shape="square"
						@click="submit"
					>
						确认
					</up-button>
				</template>
			</up-card>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useUi } from "@/composables/useUi";
import { useUserStore } from "@/stores/user";
import { useDictStore } from "@/stores/dict";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { onShow } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import singleSelect from "@/components/single-select.vue";

const ui = useUi();
const userStore = useUserStore();
const dictStore = useDictStore();
const router = useRouter();

interface Patient {
	id: string;
	name: string;
	patientNo: string;
	default: string;
	idCard: string;
	gender: string;
	occupation: string;
	patientId: number;
}

const agreeRef = ref();
const saving = ref(false);

const maxPatientCount = ref(5);
const patients = ref<Patient[]>([]);

const form = reactive({
	patientNo: "",
	patientId: 0,
	name: "",
	idCard: "",
	mobile: "",
	birthDate: "",
	gender: "",
	occupation: "",
	default: 1,
});

const errors = reactive<{ [key: string]: string }>({
	name: "",
	idCard: "",
	mobile: "",
});

const dutyOptions = ref<Array<{ value: string; label: string }>>([]);

onShow(() => {
	loadDutyOptions();
});

onMounted(async () => {
	await getPatient();

	console.log("maxPatientCount.value = " + maxPatientCount.value);
	console.log("patients = " + patients.value);
	console.log("patients.length = " + patients.value.length);
	if (patients.value.length >= maxPatientCount.value) {
		showError("最多只能绑定" + maxPatientCount.value + "个就诊者");
		const pages = getCurrentPages();
		if (!pages || pages.length <= 1) {
			router.home();
		} else {
			router.back();
		}
		return;
	}
});

async function getPatient() {
	const userInfo = userStore.info;
	if (!userInfo || !userInfo.id) {
		ui.showToast("用户未登录");
		patients.value = [];
		return;
	}
	try {
		const res = await service.patient.patientUser.getByUserId({
			userId: userInfo.id,
		});

		console.log("获取患者数据成功:", res);

		if (Array.isArray(res) && res.length > 0) {
			patients.value = res.map((p: any) => ({
				id: String(p.id),
				name: p.name || "未知",
				patientNo: p.patientNo || "",
				default: String(p.default) || "",
				idCard: p.idCard || "",
				gender: p.gender || "",
				occupation: p.occupation || "",
				patientId: p.patientId || 0,
			}));
		} else {
			patients.value = [];
		}
	} catch (error) {
		console.error("获取患者数据失败:", error);
		uni.showToast({
			title: "获取数据失败",
			icon: "none",
			duration: 2000,
		});
		patients.value = [];
	}
}

async function loadDutyOptions() {
	try {
		await dictStore.refresh(["duty"]);
		// 给响应式一点传播时间
		await new Promise(resolve => setTimeout(resolve, 100));
		const dutyData = dictStore.get("duty");
		console.log("[addPatient] 职业字典原始数据:", JSON.stringify(dutyData));

		if (dutyData && Array.isArray(dutyData) && dutyData.length > 0) {
			const opts = JSON.parse(JSON.stringify(dutyData))
				.map((item: any) => {
					// value 取 id（dict store 在 value 为空时已用 id 兜底），label 取 name
					const labelVal = item.label ?? item.name ?? '';
					const valueVal = item.value ?? item.id ?? '';
					return { value: String(valueVal), label: String(labelVal) };
				})
				.filter((opt: any) => opt.value && opt.label);

			console.log("[addPatient] 处理后职业选项:", JSON.stringify(opts));

			opts.unshift({ value: '', label: '请选择' });
			dutyOptions.value = opts;
		} else {
			dutyOptions.value = [{ value: '', label: '请选择' }];
		}
	} catch (error) {
		console.error('获取职业字典失败:', error);
		dutyOptions.value = [{ value: '', label: '请选择' }];
	}
}

async function validateName() {
	if (!form.name) {
		errors.name = "请输入姓名";
		showError(errors.name);
	} else if (form.name.length > 30) {
		errors.name = "姓名长度不能超过30个字符";
		showError(errors.name);
	} else {
		errors.name = "";
	}
}

async function validateIdCard() {
	const v = form.idCard.trim();
	if (!v) {
		errors.idCard = "请输入身份证号码";
		showError(errors.idCard);
		return;
	}
	if (!validateCertNo(form.idCard.toUpperCase())) {
		errors.idCard = "请输入有效的18位身份证号码";
		showError(errors.idCard);
		return;
	}
}

async function validateMobile() {
	const v = form.mobile.trim();
	if (!v) {
		errors.mobile = "请输入手机号码";
		showError(errors.mobile);
		return;
	}
	const reg = /^1[3-9][0-9]{9}$/;
	errors.mobile = reg.test(v) ? "" : "请输入有效的手机号码";
	if (errors.mobile) {
		showError(errors.mobile);
		return;
	}
}

function syncPatient() {
	console.log("form = " + form);
	if (!form.idCard || !form.name) {
		return;
	}
	console.log("patients = " + patients);
	if (checkPatientExists(form.idCard, form.name)) {
		showError("就诊者已存在");
		return;
	}
	queryPatientByIDCard(form.idCard, form.name);
}

async function queryPatientByIDCard(idCard: string, name: string) {
	try {
		if (!idCard || !name) {
			return;
		}
		await service.patient.patientInfo
			.getByIdCardAndName({
				idCard: idCard,
				name: name,
			})
			.then((res) => {
				console.log("查询患者信息响应:", res);
				if (Array.isArray(res) && res.length > 0) {
					form.patientNo = res[0].patientNo || "";
					form.occupation = res[0].occupation || "";
					form.mobile = res[0].mobile || "";
					form.patientId = res[0].id || 0;
				}
				console.log("查询患者信息响应:", form);
			});
	} catch (error: any) {
		console.error("查询患者信息失败:", error);
		showError(error?.message || "查询患者信息失败");
	}
}

function checkPatientExists(idcard: string, name: string) {
	return patients.value.some((p) => p.idCard === idcard && p.name === name);
}

async function submit() {
	await validateName();
	await validateIdCard();
	await validateMobile();

	if(errors.mobile != '' || errors.idCard != '' || errors.name != '') {
		console.log("存在错误信息" + errors.mobile + "  " + errors.idCard + "  " + errors.name);
		errors.mobile = "";
		errors.idCard = "";
		errors.name = "";
		return;
	}

	const birthYear = form.idCard.substring(6, 10);
	const birthMonth = form.idCard.substring(10, 12);
	const birthDay = form.idCard.substring(12, 14);
	const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

	const genderCode = parseInt(form.idCard.substring(16, 17));
	const gender = genderCode % 2 === 1 ? "1" : "2";
	form.birthDate = birthDate;
	form.gender = gender;

	if (agreeRef.value && agreeRef.value.check && !agreeRef.value.check()) {
		return;
	}

	const userInfo = userStore.info;
	if (!userInfo || !userInfo.id) {
		showError("用户未登录，请先登录");
		return;
	}

	saving.value = true;
	try {
		await service.patient.patientUser.addPatientUser({
			patientNo: form.patientNo,
			userId: userInfo.id,
			name: form.name,
			idCard: form.idCard.toUpperCase(),
			mobile: form.mobile,
			gender: form.gender,
			birthDate: form.birthDate,
			occupation: form.occupation,
			default: form.default,
		});
		ui.showTips("添加成功");
		const pages = getCurrentPages();
		if (!pages || pages.length <= 1) {
			router.home();
		} else {
			router.back();
		}
	} catch (e: any) {
		showError(e?.message || "提交失败，请重试");
	} finally {
		saving.value = false;
	}
}

function validateCertNo(idCard: string) {
	console.log(idCard);
	const reg = /^[1-9]\d{5}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
	if (!reg.test(idCard)) {
		console.log("身份证号码格式不合法");
		return false;
	}

	const provinceCodes = [
		"11","12","13","14","15","21","22","23","31","32","33","34","35","36","37",
		"41","42","43","44","45","46","50","51","52","53","54","61","62","63","64","65","71","81","82","91",
	];
	const provinceCode = idCard.substring(0, 2);
	if (!provinceCodes.includes(provinceCode)) {
		console.log("地址码校验不合法");
		return false;
	}

	const birthStr = idCard.substring(6, 14);
	const year = parseInt(birthStr.substring(0, 4), 10);
	const month = parseInt(birthStr.substring(4, 6), 10) - 1;
	const day = parseInt(birthStr.substring(6, 8), 10);
	const birthDate = new Date(year, month, day);
	if (
		birthDate.getFullYear() !== year ||
		birthDate.getMonth() !== month ||
		birthDate.getDate() !== day
	) {
		console.log("出生日期校验不合法");
		return false;
	}

	return true;
}

function showError(message: string) {
	uni.showModal({
		title: "",
		content: message,
		showCancel: false,
		confirmText: "确定",
		confirmColor: "#151515",
	});
	saving.value = false;
}
</script>

<style lang="scss" scoped>
.wrapper {
	padding: 24rpx;
}

.form-item {
	margin-bottom: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-row {
	display: flex;
	align-items: center;
	min-height: 92rpx;
}

.label {
	width: 220rpx;
	font-size: 28rpx;
	color: #151515;
}

.required {
	color: #f56c6c;
	margin-left: 6rpx;
}

.select {
	flex: 1;
}

.error {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #f56c6c;
}

.tips {
	color: #8a8a8a;
	font-size: 24rpx;
	line-height: 40rpx;
}

.submit-btn {
	margin-top: 20rpx;
}
</style>