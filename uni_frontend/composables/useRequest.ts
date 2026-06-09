import { isDev } from "@/config";

export function createRequest() {
	return function request(options: any): Promise<any> {
		// 动态获取 store 和 router
		const { useUserStore } = require("@/stores/user");
		const { useRouter } = require("@/composables/useRouter");
		const { storage } = require("@/composables/useStorage");

		const userStore = useUserStore();
		const router = useRouter();
		const storageUtil = storage;

		let Authorization = userStore.token || "";

		// 忽略标识
		const ignoreTokenPaths = ["/app/user/login/phone", "/app/user/login/smsCode", "/app/user/login/captcha", "/app/user/login/refreshToken"];
		ignoreTokenPaths.forEach((e: string) => {
			if (options.url?.includes(e)) {
				Authorization = "";
			}
		});

		if (isDev) {
			console.log(`[${options.method || "GET"}] ${options.url}`);
		}

		return new Promise(async (resolve, reject) => {
			function next() {
				uni.request({
					...options,
					header: {
						Authorization,
						language: uni.getLocale(),
						...options.header,
					},
					success(res: any) {
						const { code, data, message } = res.data as any;

						if (res.statusCode === 401) {
							const currentPath = router.getPath();
							if (currentPath?.includes("login")) {
								return reject({ message });
							} else {
								userStore.logout();
							}
						}

						if (res.statusCode === 502) {
							return reject({ message: "服务异常" });
						}

						if (res.statusCode === 404) {
							return reject({ message: `[404] ${options.url}` });
						}

						if (res.statusCode === 200) {
							if (code === 1000) {
								resolve(data);
							} else {
								reject({ message, code });
							}
						} else {
							reject({ message: "服务异常" });
						}
					},
					fail(err: any) {
						reject({ message: err.errMsg });
					},
				});
			}

			next();
		});
	};
}

// 请求队列
let requests: any[] = [];
let isRefreshing = false;

export function useRequest() {
	const request = createRequest();

	return {
		request,
	};
}