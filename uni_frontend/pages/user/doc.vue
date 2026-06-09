<template>
	<view class="doc mp-html">
		<mp-html :content="content"></mp-html>
	</view>
</template>

<script setup lang="ts">
import { onReady } from "@dcloudio/uni-app";
import { ref } from "vue";
import { useRouter } from "@/composables/useRouter";
import { service } from "@/composables/useService";

const router = useRouter();

const content = ref("");

onReady(() => {
	const { title, key } = router.getQuery();

	console.log("doc page query:", router.getQuery());
	console.log("key:", key);

	uni.setNavigationBarTitle({
		title,
	});

	if (!key) {
		console.error("key is empty!");
		return;
	}

	service.base.comm
		.param({
			key,
		})
		.then((res: any) => {
			console.log("comm.param response:", res);
			// API 直接返回 { content: "..." } 结构
			content.value = res?.content || "";
			console.log("content set to:", content.value?.substring?.(0, 100));
		})
		.catch((err: any) => {
			console.error("comm.param error:", err);
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
