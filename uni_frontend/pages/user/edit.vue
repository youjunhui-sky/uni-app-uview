<template>
	<page-wrapper>
		<view class="page">
			<view class="form">
				<view class="form-item">
					<text size="small" color="#666" :customStyle="{ marginBottom: '12rpx' }">
						{{ t('昵称') }}
					</text>
					<up-input
						v-model="form.nickName"
						type="nickname"
						:border="false"
						:customStyle="{ height: '80rpx', borderRadius: '12rpx' }"
						:placeholder="t('请填写昵称')"
					/>
				</view>
			</view>

			<view class="footer" :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }">
				<up-button
					type="primary"
					:loading="loading"
					:customStyle="{ width: '100%' }"
					shape="square"
					@click="save"
				>
					{{ t("保存") }}
				</up-button>
			</view>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { useUi } from "@/composables/useUi";
import { onReady } from "@dcloudio/uni-app";
import { useI18n } from "vue-i18n";
import pageWrapper from "@/components/page-wrapper.vue";

const router = useRouter();
const userStore = useUserStore();
const ui = useUi();
const { t } = useI18n();

const loading = ref(false);

const form = reactive({
	nickName: "",
});

async function save() {
	loading.value = true;

	await userStore.update(form).catch((err) => {
		ui.showToast(err.message);
	});

	loading.value = false;

	ui.showTips(t("用户信息保存成功"), () => {
		router.back();
	});
}

onReady(() => {
	form.nickName = userStore.info?.nickName || "";
});
</script>

<style lang="scss" scoped>
.page {
	.form {
		padding: 20rpx 24rpx;

		.form-item {
			background-color: #fff;
			border-radius: 12rpx;
			padding: 24rpx;
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 24rpx;
		background-color: #fff;
	}
}
</style>