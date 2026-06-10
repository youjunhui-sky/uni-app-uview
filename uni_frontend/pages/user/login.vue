<template>
	<page-wrapper background-color="#fff">
		<up-navbar title="" :border="false" :bgColor="'transparent'">
			<template #left>
				<view class="navbar-home" @tap="goHome">
					<Icon name="mdi:home" :size="22" color="#333" />
				</view>
			</template>
		</up-navbar>

		<view class="page-login">
			<!-- Logo -->
			<view class="logo">
				<image src="/static/logo.png" mode="aspectFill" />
				<text>{{ appName }}</text>
			</view>

			<view class="container">
				<!-- 登录方式 -->
				<view class="mode" :class="[`is-${mode}`]">
					<!-- 手机号 -->
					<template v-if="mode == 'phone'">
						<text class="label">{{ t("手机号登录") }}</text>

						<view class="phone">
							<text>+86</text>
							<up-input
								v-model="phone"
								type="number"
								:placeholder="t('请填写手机号码')"
								:border="false"
								:maxlength="11"
								:customStyle="{ fontSize: '30rpx', backgroundColor: 'transparent' }"
							/>
						</view>

						<sms-btn
							:ref="setRefs('smsBtn')"
							:phone="phone"
							@success="phoneLogin(false)"
						>
							<template #default="{ disabled, btnText }">
								<up-button
									type="primary"
									:disabled="disabled"
									:customStyle="{ width: '100%', height: '90rpx', fontSize: '30rpx' }"
									shape="square"
									@click="phoneLogin"
								>
									{{ btnText }}
								</up-button>
							</template>
						</sms-btn>
					</template>

					<!-- 微信登录 -->
					<template v-else-if="mode == 'wx'">
						<up-button
							type="primary"
							:loading="loading"
							:customStyle="{ width: '100%', height: '90rpx', fontSize: '30rpx' }"
							shape="square"
							@click="wxLogin"
						>
							{{ t("微信一键登录") }}
						</up-button>
					</template>

					<!-- 协议 -->
					<view class="agree">
						<agree-btn :ref="setRefs('agreeBtn')" />
					</view>
				</view>
			</view>

			<!-- 其他登录方式 -->
			<view class="other" v-if="!isEmpty(platformsEnv)">
				<up-divider :width="400" :customStyle="{ backgroundColor: '#ffffff' }">
					<text color="#ccc" :text="t('其他登录方式')" />
				</up-divider>

				<view class="platform">
					<view
						class="platform__item"
						v-for="(item, index) in platformsEnv"
						:key="index"
						@click="changeMode(item)"
					>
						<image :src="item.icon" mode="aspectFit" v-if="item.icon" />
						<text>{{ item.label }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 用户信息完善 -->
		<up-popup
			:show="edit.visible"
			mode="bottom"
			:round="32"
			closable
			@close="edit.onClose"
		>
			<view class="edit-popup">
				<text block bold size="large">{{ t("获取你的头像、昵称") }}</text>
				<text block :customStyle="{ marginTop: '24rpx' }" color="info">
					{{ t("用于向用户提供有辨识度的界面") }}
				</text>

				<up-cell-group :customStyle="{ marginTop: '60rpx' }" :border="false">
					<up-cell :border="false">
						<template #title>
							{{ t('头像') }}
						</template>
						<template #value>
							<button
								class="avatar"
								open-type="chooseAvatar"
								@chooseavatar="edit.uploadAvatar"
							>
								<up-avatar
									round
									:size="80"
									:src="edit.form.avatarUrl"
								/>
							</button>
						</template>
					</up-cell>

					<up-cell :border="false">
						<template #title>
							{{ t('昵称') }}
						</template>
						<template #value>
							<input
								class="name"
								v-model="edit.form.nickName"
								type="nickname"
								:placeholder="t('请填写昵称、限16个字符或汉字')"
								maxlength="16"
							/>
						</template>
					</up-cell>
				</up-cell-group>

				<up-button
					fill
					type="primary"
					:customStyle="{ height: '90rpx', fontSize: '30rpx' }"
					shape="square"
					@click="edit.save"
				>
					{{ t("保存") }}
				</up-button>
			</view>
		</up-popup>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { onReady } from "@dcloudio/uni-app";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { storage as storageUtil } from "@/composables/useStorage";
import { useUpload } from "@/composables/useUpload";
import { useRefs } from "@/composables/useRefs";
import { useUi } from "@/composables/useUi";
import { useWx } from "@/composables/useWx";
import { config } from "@/config";
import { cloneDeep, isEmpty } from "lodash-es";
import { useI18n } from "vue-i18n";
import SmsBtn from "@/components/sms-btn.vue";
import AgreeBtn from "@/components/agree-btn.vue";
import pageWrapper from "@/components/page-wrapper.vue";
import Icon from "@/components/icon.vue";

const router = useRouter();
const userStore = useUserStore();
const storage = storageUtil;
const { upload } = useUpload();
const { refs, setRefs } = useRefs();
const ui = useUi();
const wx = useWx();
const { t } = useI18n();

// 应用名称
const appName = config.app.name;

// 登录中
const loading = ref(false);

// 手机号
const phone = ref(storage.get("phone") || "");

// 登录类型
const type = ref<string>("");

// 登录方式
const mode = ref<string>();

// 登录平台
const platforms = ref<any[]>([
	{
		label: t("通过手机登录"),
		value: "phone",
		icon: "/pages/user/static/icon/phone.png",
		hidden: false,
	},
]);

// 环境校验
const platformsEnv = computed(() => {
	let arr = cloneDeep(platforms.value);

	// #ifdef H5
	if (wx.isWxBrowser() && arr[1]) {
		arr[1].hidden = false;
	}
	// #endif

	// #ifdef MP-WEIXIN
	if (arr[1]) {
		arr[1].hidden = false;
	}
	// #endif

	arr = arr.filter((e) => !e.hidden);

	if (!mode.value) {
		mode.value = arr[0]?.value;
	}

	return arr.filter((e) => e.value != mode.value);
});

// 切换方式
function changeMode(item: any) {
	if (item.onClick) {
		item.onClick();
	} else {
		mode.value = item.value;
	}
}

// 登录请求
async function reqLogin(key: string, data: any) {
	type.value = key;

	(service.user.login as any)[key](data)
		.then(async (res: any) => {
			userStore.setToken(res);
			await userStore.get();
			edit.check();
		})
		.catch((err) => {
			ui.showTips(err.message);
			wx.getCode();
		});
}

// 登录跳转
function nextLogin() {
	router.nextLogin(type.value);
}

// 返回主页
function goHome() {
	router.home();
}

// 短信登录
function phoneLogin(sms?: boolean) {
	if (sms) {
		check(() => {
			refs.smsBtn?.open();
		});
	} else {
		storage.set("phone", phone.value);

		router.push({
			path: "/pages/user/captcha",
			query: {
				phone: phone.value,
			},
		});
	}
}

// 微信登录
function wxLogin() {
	check(async () => {
		// #ifdef APP
		// #endif

		// #ifdef MP-WEIXIN
		loading.value = true;

		await wx
			.miniLogin()
			.then(async (res) => {
				await reqLogin("mini", res);
			})
			.catch((err) => {
				ui.showToast(err.message);
			});

		loading.value = false;
		// #endif

		// #ifdef H5
		// #endif
	});
}

// 公众号登录
function mpLogin() {
	// #ifdef H5
	wx.mpLogin().then(async (code) => {
		if (code) {
			ui.showLoading();
			await reqLogin("mp", { code });
			ui.hideLoading();
		}
	});
	// #endif
}

// 协议检测
function check(cb: () => void) {
	if (refs.agreeBtn?.check()) {
		cb();
	}
}

// 信息完善
const edit = reactive({
	visible: false,

	form: {
		avatarUrl: "",
		nickName: "",
	},

	check() {
		if (type.value == "mini" && userStore.info?.nickName == "微信用户") {
			edit.open();
		} else {
			nextLogin();
		}
	},

	open() {
		edit.visible = true;
	},

	close() {
		edit.visible = false;
	},

	onClose() {
		nextLogin();
	},

	uploadAvatar(e: { detail: { avatarUrl: string } }) {
		upload({ path: e.detail.avatarUrl })
			.then((url) => {
				edit.form.avatarUrl = url;
			})
			.catch((err) => {
				ui.showToast(err.message);
			});
	},

	save() {
		if (!edit.form.avatarUrl) {
			return ui.showToast(t("请上传头像"));
		}

		if (!edit.form.nickName) {
			return ui.showToast(t("请输入昵称"));
		}

		userStore.update(edit.form);
		edit.close();
	},
});

onReady(() => {
	mpLogin();
});
</script>

<style lang="scss" scoped>
.navbar-home {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 13px;
	height: 100%;
}

.page-login {
	.logo {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 20%;

		image {
			display: block;
			height: 150rpx;
			width: 150rpx;
			border-radius: 24rpx;
			margin-bottom: 30rpx;
			box-shadow: 0 25rpx 30rpx -25rpx #666666;
			background-color: #2c3142;
			padding: 20rpx;
			box-sizing: border-box;
		}

		text {
			font-size: 36rpx;
			font-weight: bold;
			letter-spacing: 1rpx;
			color: #333;
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 80rpx;

		.mode {
			width: 100%;
			padding: 0 80rpx;
			box-sizing: border-box;

			.label {
				display: block;
				font-size: 36rpx;
				font-weight: 500;
				margin-bottom: 30rpx;
			}

			&.is-phone {
				.phone {
					display: flex;
					align-items: center;
					background-color: #eeeeee;
					border-radius: 12rpx;
					height: 90rpx;
					margin-bottom: 30rpx;
					font-size: 30rpx;

					text {
						display: inline-block;
						padding: 0 40rpx;
						border-right: 1px solid #c8c7cc;
						font-weight: bold;
						color: #404040;
					}

					input {
						height: 100%;
						flex: 1;
						padding: 0 30rpx;
					}
				}
			}
		}

		.agree {
			text-align: center;
			margin: 50rpx -60rpx 0 0;
		}
	}

	.other {
		margin-top: 100rpx;

		.platform {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 20rpx 0 60rpx 0;

			&__item {
				display: flex;
				align-items: center;
				justify-content: center;
				border: 1px solid #000000;
				height: 30px;
				width: 130px;
				margin-bottom: 28rpx;
				border-radius: 6px;
				background-color: #ffffff;

				image {
					height: 32rpx;
					width: 32rpx;
					margin-right: 10rpx;
				}

				text {
					font-size: 24rpx;
					color: #000000;
				}
			}
		}
	}
}

.edit-popup {
	padding: 12rpx 0;

	.avatar {
		background-color: #fff;
		padding: 0;
		margin: 0;

		&::after {
			border: 0;
		}
	}

	.name {
		font-size: 28rpx;
		text-align: right;
		width: 100%;
	}
}
</style>
