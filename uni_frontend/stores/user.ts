import { logger } from "@/utils/logger";
import { defineStore } from "pinia";
import { ref } from "vue";
import { service, setGlobalToken } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";

export interface UserInfo {
	id?: string;
	name?: string;
	phone?: string;
	avatar?: string;
	[key: string]: any;
}

const useUserStore = defineStore("user", function () {
	// 标识
	const data = storage.info();
	const token = ref(data.token || "");

	// 设置标识
	function setToken(data: { token: string; expire: number; refreshToken: string; refreshExpire: number }) {
		logger.log("setToken called with:", data.token ? "valid token" : "EMPTY TOKEN!");
		token.value = data.token;
		setGlobalToken(data.token);
		logger.log("globalToken after setGlobalToken:", data.token);

		// 访问
		storage.set("token", data.token, data.expire - 5);
		// 刷新
		storage.set("refreshToken", data.refreshToken, data.refreshExpire - 5);
	}

	// 刷新标识
	async function refreshToken() {
		return service.user.login
			.refreshToken({
				refreshToken: storage.get("refreshToken"),
			})
			.then((res: any) => {
				setToken(res);
				return res.token;
			});
	}

	// 用户信息
	const info = ref<UserInfo | undefined>(data.userInfo);

	// 设置用户信息
	function set(value: UserInfo) {
		info.value = value;
		storage.set("userInfo", value);
	}

	// 更新用户信息
	async function update(data: UserInfo) {
		const merged = { ...info.value, ...data };
		set(merged);
		return service.user.info.updatePerson(data);
	}

	// 清除用户
	function clear() {
		setGlobalToken("");
		storage.remove("userInfo");
		storage.remove("token");
		storage.remove("refreshToken");
		token.value = "";
		info.value = undefined;
	}

	// 退出
	function logout() {
		clear();
		const router = useRouter();
		router.login({ reLaunch: true });
	}

	// 获取用户信息
	async function get() {
		return service.user.info
			.person()
			.then((res: any) => {
				if (res) {
					set(res);
				}
				return res;
			})
			.catch(() => {
				logout();
			});
	}

	return {
		token,
		setToken,
		refreshToken,
		info,
		get,
		set,
		update,
		logout,
	};
});

export { useUserStore };