<template>
	<page-wrapper>
		<view class="swl-detail-placeholder">
			<up-text text="SWL 诊疗详情（九宫格）开发中..." color="info" block />
			<up-text :text="`id: ${query.id || '-'}  swlNo: ${query.swlNo || '-'}`" size="small" color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";

const query = ref<Record<string, string>>({});

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});
</script>

<style lang="scss" scoped>
.swl-detail-placeholder {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
