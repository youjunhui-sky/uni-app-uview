import { proxy, value } from "./proxy";

export default {
	// 根地址
	host: proxy["/prod"]?.target || "https://iulm.com.cn",

	// 请求地址
	get baseUrl() {
		// #ifdef H5
		return `/api`;
		// #endif

		// #ifndef H5
		return this.host + "/";
		// #endif
	},
};
