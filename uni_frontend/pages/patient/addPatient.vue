<template>
	<page-wrapper>
		<view class="binding-container">
			<up-card :border="false" :customStyle="{ marginBottom: '24rpx' }">
				<template #head>
					<up-text bold size="large" text="基本信息" />
				</template>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">姓名<text class="required-mark">*</text></label>
						<up-input v-model="formData.name" placeholder="请输入姓名" :maxlength="30" @blur="validateIdCard" />
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">身份证号码<text class="required-mark">*</text></label>
						<up-input v-model="formData.idCard" type="idcard" placeholder="请输入18位身份证号码" :maxlength="18" @blur="validateIdCard" />
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">性别<text class="required-mark">*</text></label>
						<up-radio-group v-model="formData.gender">
							<up-radio label="1">男</up-radio>
							<up-radio label="2">女</up-radio>
						</up-radio-group>
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">出生年月<text class="required-mark">*</text></label>
						<date-picker v-model="formData.birthDate" placeholder="请选择出生日期" />
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">手机号码<text class="required-mark">*</text></label>
						<up-input v-model="formData.mobile" type="tel" placeholder="请输入手机号码" :maxlength="20" />
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">职业</label>
						<single-select v-model="formData.occupation" :options="occupationOptions" placeholder="请选择职业" />
					</view>
				</view>

				<view class="form-item">
					<view class="form-content">
						<label class="form-label">默认就诊人</label>
						<up-switch v-model="formData.default" :activeValue="1" :inactiveValue="0" />
					</view>
				</view>
			</up-card>

			<up-button
				class="submit-btn"
				:customStyle="{ fontSize: '34rpx' }"
				:border="false"
				plain
				fill
				:loading="loading"
				@click="submit"
				:disabled="loading"
			>
				提交
			</up-button>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue';
import { useDictStore } from "@/stores/dict";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import pageWrapper from "@/components/page-wrapper.vue";
import datePicker from "@/components/date-picker.vue";
import singleSelect from "@/components/single-select.vue";

interface Patient {
	id: string;
	name: string;
	patientNo: string;
	default: string;
	idCard: string;
	gender: string;
}

const patients = ref<Patient[]>([]);
const loading = ref(false);
const formData = reactive({
	patientNo: '',
	name: '',
	idCard: '',
	gender: '',
	birthDate: '',
	mobile: '',
	occupation: '',
	default: '0'
});

const errors = reactive<{ [key: string]: string }>({
	name: '',
	idCard: '',
	gender: '',
	birthDate: '',
	mobile: ''
});

const occupationOptions = ref<Array<{ value: string; label: string }>>([]);

onMounted(async () => {
	console.log('页面已加载，开始初始化数据');

	const userStore = useUserStore();
	const userInfo = userStore.info;

	if (!userInfo || Object.keys(userInfo).length === 0) {
		console.log('用户未登录，跳转到登录页面');
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

	await service.patient.patientUser.getByUserId({
		userId: userInfo.id
	}).then(res => {
		console.log('获取患者数据成功:', res);

		if (Array.isArray(res) && res.length > 0) {
			patients.value = res.map((p: any) => ({
				id: String(p.id),
				name: p.name || '未知',
				patientNo: p.patientNo || '',
				default: String(p.default) || '',
				idCard: p.idCard || '',
				gender: p.gender || '',
			}));
		} else {
			patients.value = [];
		}
	}).catch(error => {
		console.error('获取患者数据失败:', error);
		uni.showToast({
			title: '获取数据失败',
			icon: 'none',
			duration: 2000
		});
	});

	await loadOccupationOptions();
	console.log('初始化完成');
});

async function loadOccupationOptions() {
	try {
		const dictStore = useDictStore();
		await new Promise(resolve => setTimeout(resolve, 100));
		const dutyData = dictStore.get('duty');

		if (dutyData && Array.isArray(dutyData) && dutyData.length > 0) {
			const processedData = JSON.parse(JSON.stringify(dutyData))
				.map((item: any) => {
					if (item && typeof item === 'object') {
						if (item.value !== undefined && item.label !== undefined) {
							return { value: String(item.value), label: String(item.label) };
						} else if (item.code !== undefined && item.name !== undefined) {
							return { value: String(item.code), label: String(item.name) };
						} else if (item.id !== undefined && item.name !== undefined) {
							return { value: String(item.id), label: String(item.name) };
						}
					}
					return { value: String(item || ''), label: String(item || '') };
				})
				.filter((option: any) => option && option.value && option.label);

			processedData.unshift({ value: '', label: '请选择' });

			occupationOptions.value = [];
			setTimeout(() => {
				occupationOptions.value = processedData;
			}, 0);
		} else {
			occupationOptions.value = [];
		}
	} catch (error) {
		console.error('获取职业字典失败:', error);
		occupationOptions.value = [];
	}
}

function validateName() {
	if (!formData.name) {
		errors.name = '请输入姓名';
	} else if (formData.name.length > 30) {
		errors.name = '姓名长度不能超过30个字符';
	} else {
		errors.name = '';
	}
}

async function validateIdCard() {
	const idCard = formData.idCard;
	if (!idCard) {
		errors.idCard = '请输入身份证号码';
		return false;
	}

	const reg = /^\d{17}(\d|X|x)$|^\d{18}$/;
	if (!reg.test(idCard)) {
		errors.idCard = '请输入有效的18位身份证号码';
		return false;
	}

	const birthYear = idCard.substring(6, 10);
	const birthMonth = idCard.substring(10, 12);
	const birthDay = idCard.substring(12, 14);
	const birthDate = `${birthYear}-${birthMonth}-${birthDay}`;

	const genderCode = parseInt(idCard.substring(16, 17));
	const gender = genderCode % 2 === 1 ? '1' : '2';
	formData.birthDate = birthDate;
	formData.gender = gender;

	if (checkPatientExists(idCard, formData.name)) {
		showError('该患者已存在');
		formData.idCard = '';
		formData.name = '';
		formData.gender = '';
		formData.birthDate = '';
		return false;
	}
	await queryPatientByIDCard(idCard, formData.name);

	errors.idCard = '';
	return true;
}

function validateMobile() {
	const mobile = formData.mobile;
	if (!mobile) {
		errors.mobile = '请输入手机号码';
		return false;
	}

	const reg = /^1[3-9][0-9]{9}$/;
	if (!reg.test(mobile)) {
		errors.mobile = '请输入有效的手机号码';
		return false;
	}

	errors.mobile = '';
	return true;
}

async function queryPatientByIDCard(idCard: string, name: string) {
	try {
		if (!idCard || !name) {
			return;
		}
		await service.patient.patientInfo.getByIdCardAndName({
			idCard: idCard,
			name: name
		}).then((res) => {
			console.log('查询患者信息响应:', res);

			if (Array.isArray(res) && res.length > 0) {
				formData.patientNo = res[0].patientNo;
				formData.occupation = res[0].occupation;
				formData.mobile = res[0].mobile;
			}
			console.log('查询患者信息响应:', formData);
		});
	} catch (error) {
		console.error('查询患者信息失败:', error);
	}
}

function checkPatientExists(idcard: String, name: String) {
	return patients.value.some((p) => p.idCard === idcard && p.name === name);
}

function showError(message: string) {
	uni.showModal({
		title: '提示',
		content: message,
		showCancel: false,
		confirmText: '确定'
	});
}

async function submit() {
	if (!validateForm()) {
		return;
	}

	loading.value = true;

	console.log('提交的患者数据:', formData);
	const userStore = useUserStore();

	const userInfo = userStore.info;
	if (!userInfo || !userInfo.id) {
		uni.showToast({ title: '用户信息异常', icon: 'none' });
		loading.value = false;
		return;
	}

	await service.patient.patientUser.addPatientUser({
		userId: userInfo.id,
		patientNo: formData.patientNo,
		name: formData.name,
		idCard: formData.idCard,
		gender: formData.gender,
		birthDate: formData.birthDate,
		mobile: formData.mobile,
		occupation: formData.occupation,
		default: formData.default
	}).then((res: any) => {
		console.log('绑定患者成功:', res);
		uni.showToast({ title: '绑定成功', icon: 'success' });

		setTimeout(() => {
			uni.navigateBack();
		}, 1500);
	}).catch((error: any) => {
		console.error('绑定患者失败:', error);
		uni.showToast({ title: error.message || '绑定失败，请重试', icon: 'none' });
	});
	loading.value = false;
	console.log('提交完成' + loading.value);
}

function validateForm() {
	for (const key in errors) {
		errors[key] = '';
	}

	if (!formData.name) {
		errors.name = '请输入姓名';
		showError('请输入姓名');
		return false;
	} else if (formData.name.length > 30) {
		errors.name = '姓名长度不能超过30个字符';
		showError('姓名长度不能超过30个字符');
		return false;
	}

	const idCard = formData.idCard;
	if (!idCard) {
		errors.idCard = '请输入身份证号码';
		showError('请输入身份证号码');
		return false;
	}

	const reg = /^\d{17}(\d|X|x)$|^\d{18}$/;
	if (!reg.test(idCard)) {
		errors.idCard = '请输入有效的18位身份证号码';
		showError('请输入有效的18位身份证号码');
		return false;
	}

	const upperCaseIdCard = idCard.toUpperCase();
	formData.idCard = upperCaseIdCard;

	if (!formData.gender) {
		errors.gender = '请选择性别';
		showError('请选择性别');
		return false;
	}

	if (!formData.birthDate) {
		errors.birthDate = '请选择出生日期';
		showError('请选择出生日期');
		return false;
	}

	const mobile = formData.mobile;
	if (!mobile) {
		errors.mobile = '请输入手机号码';
		showError('请输入手机号码');
		return false;
	}

	const mobileReg = /^1[3-9][0-9]{9}$/;
	if (!mobileReg.test(mobile)) {
		errors.mobile = '请输入有效的手机号码';
		showError('请输入有效的手机号码');
		return false;
	}

	return true;
}
</script>

<style lang="scss" scoped>
.binding-container {
	padding: 24rpx;
}

.form-item {
	margin-bottom: 24rpx;
	border-bottom: 1rpx solid #f0f0f0;

	&:last-child {
		border-bottom: none;
	}
}

.form-content {
	display: flex;
	align-items: center;
	min-height: 92rpx;
}

.form-label {
	width: 200rpx;
	font-size: 28rpx;
	color: #151515;
}

.required-mark {
	color: #f56c6c;
	margin-left: 6rpx;
}

.submit-btn {
	margin-top: 20rpx;
}
</style>