import { logger } from "@/utils/logger";
import { useRouter } from "@/composables/useRouter";
import { useUserStore } from "@/stores/user";
import { service } from "@/composables/useService";
import { storage } from "@/composables/useStorage";
import { useUi } from "@/composables/useUi";
import { isEmpty } from "@/utils/comm";

// 忽略token相关页面
const ignoreToken = [
	"/pages/index/home",
	"/pages/index/website",
	"/pages/index/admin",
	"/pages/index/my",
	"/pages/user/login",
	"/pages/user/captcha",
	"/pages/user/doc",
];

// 忽略就诊人相关页面
const ignorePatient = [
	"/pages/user/edit",
	"/pages/user/set",
	"/pages/user/about",
];

// 路由前置守卫
uni.addInterceptor("navigateTo", {
	invoke(args) {
		const router = useRouter();
		const userStore = useUserStore();
		const ui = useUi();

		const path = args.url.split("?")[0];

		// 忽略的页面直接通过
		if (ignoreToken.includes(path) || path.startsWith("/pages/demo")) {
			return args;
		}

		if (userStore.token) {
			if (!ignorePatient.includes(path)) {
				const currentPatient = storage.get("currentPatient");
				const name = currentPatient?.name || "";
				if (isEmpty(name)) {
					service.patient.patientUser
						.getCurrentPatient({ userId: userStore.info?.id })
						.then((res) => {
							logger.log("查询患者信息响应:", res);
							if (!res || typeof res !== "object" || Array.isArray(res) || Object.keys(res).length === 0) {
								logger.log("-----------------");
								ui.showToast("需要添加就诊人,才能为您提供服务");
								setTimeout(() => {
									router.push({
										path: "/pages/patient/mgnPatientNew",
									});
								}, 1500);
								return;
							}
							storage.set("currentPatient", res);
							router.push(args.url);
						})
						.catch((err) => {
							logger.log(err);
							router.push(args.url);
						});
					return;
				}
			}
			return args;
		} else {
			router.login();
			return false;
		}
	},
	fail(err) {
		logger.error("路由拦截失败:", err);
	},
});