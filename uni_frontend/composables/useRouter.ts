import { last } from "lodash-es";
import { storage } from "./useStorage";

type PushOptions =
	| string
	| {
			path: string;
			mode?: "navigateTo" | "redirectTo" | "reLaunch" | "switchTab" | "preloadPage";
			events?: {
				[key: string]: (data: any) => void;
			};
			query?: {
				[key: string]: any;
			};
			params?: {
				[key: string]: any;
			};
			isGuard?: boolean;
			[key: string]: any;
	  };

// TabBar 配置
interface TabBarItem {
	pagePath: string;
	text?: string;
	iconPath?: string;
	selectedIconPath?: string;
	[key: string]: any;
}

//路由
export function useRouter() {
	// 跳转参数（地址栏）
	function getQuery() {
		// #ifdef H5
		// H5 端从 URL 解析参数（支持哈希路由 #/pages/...）
		if (typeof window !== 'undefined') {
			const hash = window.location.hash;
			if (hash) {
				const hashIndex = hash.indexOf('?');
				if (hashIndex !== -1) {
					const queryStr = hash.substring(hashIndex + 1);
					const searchParams = new URLSearchParams(queryStr);
					const query: any = {};
					searchParams.forEach((value, key) => {
						query[key] = decodeURIComponent(value);
					});
					return query;
				}
			}
			// 尝试从 search 获取
			if (window.location.search) {
				const searchParams = new URLSearchParams(window.location.search);
				const query: any = {};
				searchParams.forEach((value, key) => {
					query[key] = decodeURIComponent(value);
				});
				return query;
			}
		}
		// #endif
		// 小程序端从页面栈获取
		const info = currentPage();
		return {
			...info?.query,
		};
	}

	// 跳转参数（缓存）
	function getParams() {
		return storage.get("router-params") || {};
	}

	// 页面路径
	function getPages() {
		return {
			home: "/pages/index/home",
			login: "/pages/user/login",
		};
	}

	// 当前页面信息
	function currentPage(): { [key: string]: any } | null {
		const pages = getCurrentPages();
		if (pages.length === 0) return null;
		return last(pages)!;
	}

	// 当前路由路径
	function getPath(): string | undefined {
		return currentPage()?.route;
	}

	// TabBar 列表
	function getTabs(): TabBarItem[] {
		return [
			{
				pagePath: "pages/index/home",
				text: "首页",
				iconPath: "static/icon/tabbar/home.png",
				selectedIconPath: "static/icon/tabbar/home2.png",
			},
			{
				pagePath: "pages/index/my",
				text: "我的",
				iconPath: "static/icon/tabbar/my.png",
				selectedIconPath: "static/icon/tabbar/my2.png",
			},
		];
	}

	// 是否是 Tab 页
	function isTab(path: string) {
		const tabBarList = [
			{ pagePath: "pages/index/home" },
			{ pagePath: "pages/index/my" },
		];
		return !!tabBarList.find((e) => path == `/${e.pagePath}`);
	}

	// 路由跳转
	function push(options: PushOptions) {
		if (typeof options == "string") {
			options = {
				path: options,
				mode: "navigateTo",
			};
		}

		let {
			path,
			mode = "navigateTo",
			animationType,
			animationDuration,
			events,
			success,
			fail,
			complete,
			query,
			params,
		} = options || {};

		if (query) {
			let arr: string[] = [];
			for (let i in query) {
				if (query[i] !== undefined) {
					arr.push(`${i}=${query[i]}`);
				}
			}
			path += "?" + arr.join("&");
		}

		if (params) {
			storage.set("router-params", params);
		}

		let data: any = {
			url: path,
			animationType,
			animationDuration,
			events,
			success,
			fail,
			complete,
		};

		if (isTab(path)) {
			mode = "switchTab";
		}

		switch (mode) {
			case "navigateTo":
				uni.navigateTo(data);
				break;
			case "redirectTo":
				uni.redirectTo(data);
				break;
			case "reLaunch":
				uni.reLaunch(data);
				break;
			case "switchTab":
				uni.switchTab(data);
				break;
			case "preloadPage":
				uni.preloadPage(data);
				break;
		}
	}

	// 后退
	function back(options?: UniApp.NavigateBackOptions) {
		if (isFirstPage()) {
			home();
		} else {
			uni.navigateBack(options || {});
		}
	}

	// 执行当前页面的某个方法
	function callMethod(name: string, data?: any) {
		const page = currentPage();
		if (page) {
			const vm = (page as any).$vm;
			if (vm) {
				if ((vm as any).$.exposed?.[name]) {
					return (vm as any).$.exposed[name](data);
				}
			}
		}
	}

	// 页面栈长度是否只有1
	function isFirstPage() {
		return getCurrentPages().length == 1;
	}

	// 回到首页
	function home() {
		push(getPages().home);
	}

	// 跳转 Tab 页
	function switchTab(name: string) {
		const tabBarMap: Record<string, string> = {
			home: "/pages/index/home",
			my: "/pages/index/my",
		};
		const path = tabBarMap[name];
		if (path) {
			push({
				path,
				mode: "switchTab",
			});
		} else {
			console.error("Not found tab", name);
		}
	}

	// 去登陆
	function login(options?: { reLaunch: boolean }) {
		const { reLaunch = false } = options || {};
		push({
			path: getPages().login,
			mode: reLaunch ? "reLaunch" : "navigateTo",
		});
	}

	// 登录成功后操作
	function nextLogin(type?: string) {
		const pages = getCurrentPages();
		const index = pages.findIndex((e) => e.route?.includes("login"));

		if (index <= 0) {
			home();
		} else {
			back({
				delta: pages.length - index,
			});
		}

		// 登录方式
		storage.set("loginType", type);

		// 登录回调
		uni.$emit("afterLogin", { type });
	}

	return {
		getQuery,
		getParams,
		getPages,
		currentPage,
		getPath,
		getTabs,
		isTab,
		push,
		back,
		callMethod,
		isFirstPage,
		home,
		switchTab,
		login,
		nextLogin,
	};
}