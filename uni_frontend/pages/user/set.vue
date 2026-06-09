<template>
	<page-wrapper>
		<view class="page-set">
			<template v-if="userStore.info">
				<up-text :text="t('账号')" :customStyle="{ margin: '0 0 20rpx 20rpx' }" block />

				<up-cell-group :border="false" :customStyle="{ borderRadius: '16rpx' }">
					<up-cell :border="false">
						<template #title>
							{{ t('头像') }}
						</template>
						<template #value>
							<view class="avatar">
								<!-- #ifdef MP-WEIXIN -->
								<button open-type="chooseAvatar" @chooseavatar="uploadAvatar">
									<up-avatar round :size="88" :src="userStore.info.avatarUrl" />
								</button>
								<!-- #endif -->

								<!-- #ifndef MP-WEIXIN -->
								<up-avatar
									round
									:size="88"
									:src="userStore.info.avatarUrl"
									@click="uploadAvatar()"
								/>
								<!-- #endif -->
							</view>
						</template>
					</up-cell>

					<up-cell
						:title="t('昵称')"
						:value="userStore.info.nickName"
						@click="router.push('/pages/user/edit')"
					>
						<template #right-icon>
							<Icon name="mdi:chevron-right" :size="18" color="#999" />
						</template>
					</up-cell>

					<up-cell :border="false">
						<template #title>
							{{ t('手机号') }}
						</template>
						<template #value>
							<up-text :text="userStore.info.phone" />
						</template>
					</up-cell>
				</up-cell-group>

				<up-text :text="t('关于')" :customStyle="{ margin: '30rpx 0 20rpx 20rpx' }" block />

				<up-cell-group :border="false" :customStyle="{ borderRadius: '16rpx' }">
					<up-cell
						:title="`${t('关于')} ${config.app.name}`"
						@click="router.push('/pages/user/about')"
					>
						<template #right-icon>
							<Icon name="mdi:chevron-right" :size="18" color="#999" />
						</template>
					</up-cell>

					<up-cell
						:title="t('用户协议')"
						@click="router.push({ path: '/pages/user/doc', query: { key: 'userAgreement', title: t('用户协议') } })"
					>
						<template #right-icon>
							<Icon name="mdi:chevron-right" :size="18" color="#999" />
						</template>
					</up-cell>

					<up-cell
						:title="t('隐私政策')"
						@click="router.push({ path: '/pages/user/doc', query: { key: 'privacyPolicy', title: t('隐私政策') } })"
					>
						<template #right-icon>
							<Icon name="mdi:chevron-right" :size="18" color="#999" />
						</template>
					</up-cell>
				</up-cell-group>

				<up-cell-group :border="false" :customStyle="{ borderRadius: '16rpx' }">
					<up-cell
						:title="t('切换账号')"
						@click="router.push('/pages/user/login')"
					>
						<template #right-icon>
							<Icon name="mdi:chevron-right" :size="18" color="#999" />
						</template>
					</up-cell>

					<up-cell
						:border="false"
						@click="userStore.logout()"
					>
						<template #title>
							{{ t('退出登录') }}
						</template>
						<template #value>
							<Icon name="mdi:arrow-right" :size="18" />
						</template>
					</up-cell>
				</up-cell-group>
			</template>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { onReady } from "@dcloudio/uni-app";
import { config } from "@/config";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { useUi } from "@/composables/useUi";
import { useUpload } from "@/composables/useUpload";
import { useI18n } from "vue-i18n";
import pageWrapper from "@/components/page-wrapper.vue";
import Icon from "@/components/icon.vue";

const router = useRouter();
const userStore = useUserStore();
const { upload } = useUpload();
const ui = useUi();
const { t } = useI18n();

// 上传头像
function uploadAvatar(e?: { detail: { avatarUrl: string } }) {
	function next(path: string) {
		upload({ path }).then((url) => {
			ui.showToast(t("头像更新成功"));

			userStore.update({
				avatarUrl: url,
			});
		});
	}

	if (e) {
		next(e.detail.avatarUrl);
	} else {
		uni.chooseImage({
			count: 1,
			success(res) {
				// @ts-ignore
				next(res.tempFiles[0].path);
			},
		});
	}
}

onReady(() => {
	userStore.get();
});
</script>

<style lang="scss" scoped>
.page-set {
	padding: 20rpx 24rpx;

	.avatar {
		padding: 10rpx 0;
		height: 88rpx;

		button {
			padding: 0;
			margin: 0;
			line-height: normal;
			background-color: transparent;

			&::after {
				border: 0;
			}
		}
	}
}
</style>