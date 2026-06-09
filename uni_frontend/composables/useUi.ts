/**
 * useUi 适配层 - 替代 cool-ui 的 useUi()
 * 将 showToast/showTips/showLoading/showConfirm 等方法适配为 uni-app 原生 API
 */

interface ShowConfirmOptions {
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
}

interface ShowTipsOptions {
	title?: string;
	message?: string;
}

export function useUi() {
	// 显示 Toast 提示
	const showToast = (text: string, icon: "none" | "success" | "error" | "loading" | "fail" | "exception" | "none" = "none") => {
		uni.showToast({
			title: text,
			icon: icon,
			duration: 2000,
		});
	};

	// 显示成功提示
	const showSuccess = (text: string) => {
		uni.showToast({
			title: text,
			icon: "success",
			duration: 2000,
		});
	};

	// 显示失败提示
	const showError = (text: string) => {
		uni.showToast({
			title: text,
			icon: "error",
			duration: 2000,
		});
	};

	// 显示加载中
	const showLoading = (text: string = "加载中...") => {
		uni.showLoading({
			title: text,
			mask: true,
		});
	};

	// 隐藏加载
	const hideLoading = () => {
		uni.hideLoading();
	};

	// 显示确认对话框
	const showConfirm = (options: ShowConfirmOptions): Promise<any> => {
		return new Promise((resolve, reject) => {
			uni.showModal({
				title: options.title || "提示",
				content: options.message || "",
				confirmText: options.confirmText || "确定",
				cancelText: options.cancelText || "取消",
				showCancel: options.showCancel !== false,
				success: (res) => {
					if (res.confirm) {
						resolve(res);
					} else {
						reject(res);
					}
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	};

	// 显示 Tips 提示（无图标）
	const showTips = (text: string, callback?: () => void) => {
		uni.showToast({
			title: text,
			icon: "none",
			duration: 2000,
		});
		if (callback) {
			setTimeout(callback, 2000);
		}
	};

	return {
		showToast,
		showSuccess,
		showError,
		showLoading,
		hideLoading,
		showConfirm,
		showTips,
	};
}