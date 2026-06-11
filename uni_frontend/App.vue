<script setup lang="ts">
import { logger } from "@/utils/logger";
import { useUserStore } from "@/stores/user";
import { useDictStore } from "@/stores/dict";
import { onLaunch, onShow, onHide, onError } from "@dcloudio/uni-app";

// 全局错误处理
onError((error: any) => {
	const errorStr = JSON.stringify(error || {}) + (error?.errMsg || "") + (error?.message || "");

	if (
		errorStr.includes("webapi_getwxaasyncsecinfo:fail") ||
		errorStr.includes("SystemError") ||
		errorStr.includes("appServiceSDKScriptError") ||
		error?.errMsg?.includes("webapi_getwxaasyncsecinfo:fail") ||
		error?.message?.includes("webapi_getwxaasyncsecinfo:fail")
	) {
		return;
	}

	logger.error("全局错误捕获:", error);
});

onLaunch(() => {
	logger.log("App Launch");

	// 处理未捕获的 Promise rejection
	// #ifdef MP-WEIXIN
	const wxGlobal = (globalThis as any).wx || (window as any).wx;
	if (wxGlobal && wxGlobal.onUnhandledRejection) {
		wxGlobal.onUnhandledRejection((res: any) => {
			const rejectionStr =
				JSON.stringify(res || {}) +
				(res?.reason?.errMsg || "") +
				(res?.reason?.message || "");
			if (
				rejectionStr.includes("webapi_getwxaasyncsecinfo:fail") ||
				rejectionStr.includes("SystemError") ||
				rejectionStr.includes("appServiceSDKScriptError") ||
				res?.reason?.errMsg?.includes("webapi_getwxaasyncsecinfo:fail") ||
				res?.reason?.message?.includes("webapi_getwxaasyncsecinfo:fail")
			) {
				return;
			}
			logger.error("未处理的 Promise rejection:", res);
		});
	}
	// #endif

	const userStore = useUserStore();
	const dictStore = useDictStore();

	// 获取字典
	dictStore.refresh();

	if (userStore.token) {
		// 获取登录用户信息
		// userStore.get();
	}
});

onShow(() => {
	logger.log("App Show");
});

onHide(() => {
	logger.log("App Hide");
});
</script>

<style lang="scss">
/* uView Plus 样式 */
@import "uview-plus/index.scss";
/* 项目自定义样式 */
@import "@/static/css/index.scss";
</style>