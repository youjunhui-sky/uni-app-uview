<template>
	<view class="swl-report">
		<view class="swl-empty">
			<view class="swl-empty__icon">
				<Icon name="mdi:wrench" :size="64" color="#c0c4cc" />
			</view>
			<text class="swl-empty__title">功能开发中</text>
			<text class="swl-empty__desc">SWL 诊疗功能正在开发中，敬请期待</text>
		</view>
	</view>
</template>

<script lang="ts" setup>
import Icon from "@/components/icon.vue";
</script>

<style lang="scss" scoped>
.swl-report {
	.swl-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 48rpx;

		&__icon {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 144rpx;
			height: 144rpx;
			border-radius: 50%;
			background-color: #f5f7fa;
		}

		&__title {
			margin-top: 24rpx;
			font-size: 32rpx;
			font-weight: bold;
			color: #303133;
		}

		&__desc {
			margin-top: 16rpx;
			font-size: 26rpx;
			color: #909193;
			text-align: center;
		}
	}
}
</style>
