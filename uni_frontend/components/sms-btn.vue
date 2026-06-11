<template>
	<view class="sms-btn">
		<slot :disabled="isDisabled" :countdown="countdown" :btnText="btnText">
			<up-button
				:border="false"
				:customStyle="{ backgroundColor: 'transparent', color: '#FE6B03' }"
				:size="size"
				:disabled="isDisabled"
				@click="open"
			>
				{{ btnText }}
			</up-button>
		</slot>

		<up-popup :show="captcha.visible" mode="center" round="24">
			<view class="sms-popup">
				<view class="head">
					<up-text bold size="large" :text="$t('获取短信验证码')" />
					<text class="close-btn" @click="close">✕</text>
				</view>

				<view class="row">
					<up-input
						v-model="form.code"
						:placeholder="$t('验证码')"
						:maxlength="4"
						:customStyle="{ height: '70rpx', backgroundColor: '#f7f7f7', borderRadius: '8rpx' }"
						:clearable="false"
						border="false"
						@confirm="send"
					/>

					<img :src="captcha.img" style="height:70rpx;width:200rpx;flex-shrink:0;" @tap="getCaptcha" />
				</view>

				<up-button
					type="primary"
					fill
					:disabled="!form.code"
					:loading="captcha.sending"
					:customStyle="{ height: '70rpx' }"
					shape="square"
					@click="send"
				>
					{{ $t("发送短信") }}
				</up-button>
			</view>
		</up-popup>
	</view>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { computed, type PropType, reactive, ref } from "vue";
import { service } from "@/composables/useService";
import { useUi } from "@/composables/useUi";
import { useI18n } from "vue-i18n";

const props = defineProps({
	phone: String,
	type: String,
	height: Number,
	fontSize: Number,
	size: String as PropType<"large" | "default" | "small">,
	border: {
		type: Boolean,
		default: true,
	},
	plain: Boolean,
});

const emit = defineEmits(["success"]);

const ui = useUi();
const { t } = useI18n();

// 验证码
const captcha = reactive({
	visible: false,
	loading: false,
	sending: false,
	img: "",
});

// 倒计时
const countdown = ref(0);

// 是否禁用
const isDisabled = computed(() => countdown.value > 0 || !props.phone);

// 按钮文案
const btnText = computed(() =>
	countdown.value > 0 ? t("{n}s后重新获取", { n: countdown.value }) : t("获取验证码")
);

// 表单
const form = reactive({
	code: "",
	captchaId: "",
});

// 开始倒计时
function startCountdown() {
	countdown.value = 60;

	function fn() {
		countdown.value--;

		if (countdown.value < 1) {
			clearInterval(timer);
		}
	}

	const timer = setInterval(fn, 1000);
	fn();
}

// 发送短信
async function send() {
	if (form.code) {
		captcha.sending = true;

		await service.user.login
			.smsCode({
				phone: props.phone,
				...form,
			})
			.then(() => {
				ui.showToast(t("短信已发送，请查收"));
				startCountdown();
				close();
				emit("success");
			})

			.catch((err) => {
				ui.showToast(err.message);
				getCaptcha();
			});

		captcha.sending = false;
	} else {
		ui.showToast(t("请填写验证码"));
	}
}

// 获取图片验证码
async function getCaptcha() {
	clear();
	captcha.loading = true;

	await service.user.login
		.captcha({ color: "#2c3142", phone: props.phone })
		.then((res: any) => {
			logger.log("验证码响应:", res);
			logger.log("设置 img,长度:", res.data?.length);
			form.captchaId = res.captchaId;
			captcha.img = res.data;
			logger.log("captcha.img 设置后:", captcha.img?.substring(0, 100));
			logger.log("captcha.visible:", captcha.visible);
		})
		.catch((err) => {
			ui.showToast(err.message);
		});

	captcha.loading = false;
}

// 打开
function open() {
	if (props.phone) {
		if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(props.phone)) {
			captcha.visible = true;
			getCaptcha();
		} else {
			ui.showToast(t("请填写正确的手机号格式"));
		}
	}
}

// 关闭
function close() {
	captcha.visible = false;
	clear();
}

// 清空
function clear() {
	form.code = "";
	form.captchaId = "";
}

defineExpose({
	open,
	send,
	getCaptcha,
	startCountdown,
});
</script>

<style lang="scss" scoped>
.sms-popup {
	width: 600rpx;
	padding: 40rpx 32rpx;
	box-sizing: border-box;

	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.close-btn {
		font-size: 32rpx;
		color: #999;
		padding: 8rpx;
	}

	.row {
		display: flex;
		align-items: center;
		margin-bottom: 30rpx;

		image {
			height: 70rpx;
			width: 200rpx;
			flex-shrink: 0;
		}
	}
}
</style>