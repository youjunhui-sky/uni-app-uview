<template>
	<view class="swl-report">
		<up-card :border="false">
			<template #head>
				<up-text bold size="large" text="SWL诊疗" />
			</template>
			<view class="swl-content">
				<up-text size="small" color="info" text="SWL诊疗功能组件" />
			</view>
		</up-card>
	</view>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.swl-report {
	.swl-content {
		padding: 40rpx 0;
		text-align: center;
	}
}
</style>