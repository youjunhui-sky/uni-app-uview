import { createSSRApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { i18n } from "./locale";
import "./router";

// uView Plus 插件
import uviewPlus from "uview-plus";
import "uview-plus/index.scss";

// 在应用启动前设置错误过滤
// #ifdef MP-WEIXIN
if (typeof console !== "undefined") {
	const originalError = console.error;
	console.error = function (...args: any[]) {
		// 过滤微信小程序开发工具的内部错误
		const errorStr = args.map((arg) => String(arg)).join(" ");
		if (
			errorStr.includes("webapi_getwxaasyncsecinfo:fail") ||
			errorStr.includes("SystemError") ||
			errorStr.includes("appServiceSDKScriptError")
		) {
			// 静默忽略，不输出到控制台
			return;
		}
		// 其他错误正常输出
		originalError.apply(console, args);
	};
}
// #endif

export function createApp() {
	const app = createSSRApp(App);
	app.use(i18n);
	app.use(uviewPlus); // 注册 uView Plus
	app.use(createPinia()); // 注册 Pinia

	return {
		app,
	};
}