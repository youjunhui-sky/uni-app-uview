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
							<label class="label">姓名</label>
							<label class="label">{{ form.name }}</label>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">身份证号码</label>
							<label class="label">{{ form.idCard }}</label>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">手机号</label>
							<label class="label">{{ form.mobile }}</label>
						</view>
					</view>

					<view class="form-item">
						<view class="form-row">
							<label class="label">职业</label>
							<single-select
								v-model="form.duty"
								:options="dutyOptions"
								placeholder="请选择职业"
								class="select"
							/>
						</view>
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
import { logger } from "@/utils/logger";
import { reactive, ref, computed, onMounted } from "vue";
import { useUi } from "@/composables/useUi";
import { useUserStore } from "@/stores/user";
import { useDictStore } from "@/stores/dict";
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import singleSelect from "@/components/single-select.vue";

const ui = useUi();
const userStore = useUserStore();
const dictStore = useDictStore();
const router = useRouter();

const agreeRef = ref();
const saving = ref(false);

// 最大就诊卡数量
const maxPatientCount = ref(5);

// 患者数据
const patients = ref<Patient[]>([]);

const form = reactive({
	patientNo: "",
	name: "",
	idCard: "",
	mobile: "",
	duty: "",
	birthDate: "",
	gender: "",
	default: 1,
});

const errors = reactive<{ [key: string]: string }>({
	name: "",
	idCard: "",
	mobile: "",
});

const dutyOptions = ref<Array<{ value: string; label: string }>>([]);

const patientId = ref(0);

onShow(() => {
	loadDutyOptions();
});

onMounted(() => {
	const q = router.getQuery() as any;
	const params = router.getParams() as any;
	const patientNo = String(params?.patientNo || q?.patientNo || "");
	patientId.value = params?.patientId || q?.patientId || 0;
	logger.log("patientId", patientId.value);
	logger.log("patientNo", patientNo);
	logger.log("query", q);
	logger.log("params", params);
	service.patient.patientUser
		.getByUserIdAndPatientNo({
			userId: userStore.info?.id,
			patientNo: patientNo,
		})
		.then((res) => {
			logger.log("res", res);
			const list = Array.isArray(res) ? res : [];
			if (list.length == 1) {
				form.patientNo = list[0].patientNo || "";
				form.name = list[0].name || "";
				form.idCard = list[0].idCard || "";
				form.mobile = list[0].mobile || "";
				form.duty = list[0].occupation || "";
				form.birthDate = list[0].birthDate || "";
				form.gender = list[0].gender || "";
			} else {
				logger.log("异常数据！");
			}
			logger.log("form.duty", form.duty);
		});
});

async function loadDutyOptions() {
	await dictStore.refresh(["duty"]);

	const dutyData = dictStore.get("duty");
	if (Array.isArray(dutyData)) {
		const opts = dutyData.map((item: any) => {
			return { value: String(item.name), label: String(item.name) };
		});

		opts.unshift({ value: "", label: "" });
		dutyOptions.value = opts;

		logger.log("加载完成职业", dutyOptions.value);
	}
}

async function submit() {
	logger.log("patientId", patientId.value);
	await service.patient.patientInfo
		.update({
			id: patientId.value,
			occupation: form.duty,
		})
		.then(() => {
			ui.showTips("修改成功");
			const pages = getCurrentPages();
			if (!pages || pages.length <= 1) {
				router.home();
			} else {
				router.back();
			}
		})
		.catch((e: any) => {
			logger.log("e", e);
			showError(e?.message || "提交失败，请重试");
		});
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