<template>
	<view class="doc mp-html">
		<mp-html :content="content"></mp-html>
	</view>
</template>

<script setup lang="ts">
import { logger } from "@/utils/logger";
import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
import { useRouter } from "@/composables/useRouter";
import { service } from "@/composables/useService";

const router = useRouter();

const content = ref("");

onReady(() => {
	const { title, key } = router.getQuery();

	logger.log("doc page query:", router.getQuery());
	logger.log("key:", key);

	uni.setNavigationBarTitle({
		title,
	});

	if (!key) {
		logger.error("key is empty!");
		return;
	}

	service.base.comm
		.param({
			key,
		})
		.then((res: any) => {
			logger.log("comm.param response:", res);
			// API 直接返回 { content: "..." } 结构
			content.value = res?.content || "";
			logger.log("content set to:", content.value?.substring?.(0, 100));
		})
		.catch((err: any) => {
			logger.error("comm.param error:", err);
		});
});
</script>

<style lang="scss" scoped>
.doc {
	padding: 20rpx;
	min-height: 100vh;
	background: #fff;
}
</style>
