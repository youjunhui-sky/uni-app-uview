<template>
	<page-wrapper background-color="#fff">
		<view class="page-captcha">
			<up-navbar title="" :border="false" />

			<view class="container">
				<text class="label">{{ t("输入验证码") }}</text>
				<text class="tips">{{ t("已发送至") }} +86 {{ form.phone }}</text>

				<view class="code">
					<otp-input
						v-model="form.smsCode"
						:length="len"
						@finish="next"
					/>
				</view>

				<up-button
					type="primary"
					:disabled="form.smsCode.length !== len"
					:loading="saving"
					:customStyle="{ width: '100%', height: '90rpx', fontSize: '30rpx' }"
					shape="square"
					@click="next"
				>
					{{ t("确定") }}
				</up-button>

				<view class="send">
					<sms-btn
						size="small"
						:border="false"
						:phone="form.phone"
						:ref="setRefs('smsBtn')"
					/>
				</view>
			</view>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { onReady } from "@dcloudio/uni-app";
import { reactive, ref } from "vue";
import { storage } from "@/composables/useStorage";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { useUi } from "@/composables/useUi";
import { useRefs } from "@/composables/useRefs";
import SmsBtn from "/@/components/sms-btn.vue";
import { useI18n } from "vue-i18n";
import pageWrapper from "@/components/page-wrapper.vue";
import otpInput from "@/components/otp-input.vue";

const router = useRouter();
const userStore = useUserStore();
const { refs, setRefs } = useRefs();
const ui = useUi();
const { t } = useI18n();

// 验证码长度
const len = 4;

// 保存状态
const saving = ref(false);

// 表单
const form = reactive({
	smsCode: "",
	phone: "",
});

// 下一步
function next() {
	saving.value = true;
	service.user.login
		.phone(form)
		.then(async (res) => {
			// 设置token - 传递完整响应对象
			userStore.setToken(res);
			// 设置用户信息 - 确保数据存在
			if (res.userInfo) {
				userStore.set(res.userInfo);
			} else {
				logger.log("响应中没有userInfo，尝试获取用户信息");
				// 如果响应中没有用户信息，主动获取
				await userStore.get();
			}
			storage.set("currentPatient", res.userInfo?.currentPatient || null);
			// 登录跳转
			router.nextLogin();
		})
		.catch((err) => {
			ui.showTips(err.message || t("登录失效，请重试~"));
			saving.value = false;
			form.smsCode = "";
		});
}

onReady(() => {
	form.phone = router.getQuery().phone || "";
	refs.smsBtn.startCountdown();
});
</script>

<style lang="scss" scoped>
.page-captcha {
	.container {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin: 0 auto;
		padding-top: 140rpx;
	}

	.label {
		font-size: 52rpx;
		font-weight: 500;
		margin-bottom: 44rpx;
		font-weight: bold;
		color: #151515;
	}

	.tips {
		font-size: 28rpx;
		color: #151515;
		font-weight: 500;
	}

	.code {
		margin: 34rpx 0 62rpx 0;
	}

	.send {
		display: flex;
		justify-content: center;
		font-size: 24rpx;
		margin-top: 30rpx;
	}
}
</style>