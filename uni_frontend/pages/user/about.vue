<template>
	<page-wrapper>
		<view class="page-about">
			<view class="logo">
				<image src="/static/logo.png" />
			</view>

			<!-- 版本信息 -->
			<view class="version-info">
				<text type="primary" size="large">{{ config.app.name }}</text>
			</view>

			<up-cell-group>
				<up-cell title="联系我们" :border="false" />
			</up-cell-group>

			<text
				block
				align="center"
				size="mini"
				color="info"
				:customStyle="{ marginTop: '80rpx', lineHeight: '1.2' }"
			>
				{{ config.app.desc }}
			</text>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { onReady } from "@dcloudio/uni-app";
import { config } from "@/config";
import { useI18n } from "vue-i18n";
import pageWrapper from "@/components/page-wrapper.vue";

const { t } = useI18n();

onReady(() => {
	uni.setNavigationBarTitle({
		title: `${t("关于")} ${config.app.name}`,
	});
});
</script>

<style lang="scss" scoped>
.page-about {
	.logo {
		display: flex;
		justify-content: center;
		padding: 100rpx 0;

		image {
			height: 160rpx;
			width: 160rpx;
			border-radius: 24rpx;
			box-shadow: 0 25rpx 30rpx -25rpx #666666;
		}
	}

	.version-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 40rpx;
	}
}
</style>