import UQRCode from "uqrcodejs";

/**
 * 生成二维码（返回 base64 图片字符串）
 */
export async function generateQRCode(text: string, width = 200, height = 200): Promise<string> {
	let result!: Promise<string>;

	// #ifdef H5
	result = new Promise((resolve, reject) => {
		try {
			const size = Math.min(width, height);
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");

			if (!ctx) {
				reject(new Error("无法获取 canvas 上下文"));
				return;
			}

			const qr = new UQRCode({
				data: text,
				size: size,
			});
			qr.make();

			// 走公开 API：uqrcodejs 自己负责背景填白和模块绘制，不依赖私有字段
			qr.canvasContext = ctx;
			qr.drawCanvas(() => {
				resolve(canvas.toDataURL("image/png"));
			});
		} catch (e) {
			reject(e);
		}
	});
	// #endif

	// #ifndef H5
	// 小程序环境：使用 uQRCode 本地生成二维码，避免患者信息泄露给第三方
	result = new Promise((resolve, reject) => {
		try {
			const size = Math.min(width, height);
			const qr = new UQRCode({
				data: text,
				size: size,
			});
			qr.make();

			// #ifdef MP-WEIXIN
			// 微信新版 type="2d" canvas：必须通过 SelectorQuery 取 node
			// uni 类型定义的 fields() 签名跟小程序原生签名不一致，这里 cast 走原生 API
			((uni as any).createSelectorQuery() as any)
				.select("#qrcode-canvas")
				.fields({ node: true, size: true })
				.exec((res: any) => {
					const canvas = res[0]?.node;
					if (!canvas) {
						reject(new Error("找不到 qrcode-canvas 节点"));
						return;
					}
					const ctx = canvas.getContext("2d");
					qr.canvasContext = ctx;
					qr.drawCanvas(() => {
						canvas.toTempFilePath({
							success: (r: any) => resolve(r.tempFilePath),
							fail: reject,
						});
					});
				});
			// #endif

			// #ifndef MP-WEIXIN
			// 旧版 canvas：使用 canvasId（其他小程序/APP 平台）
			const ctx = uni.createCanvasContext("qrcode-canvas");
			qr.canvasContext = ctx;
			qr.drawCanvas(() => {
				uni.canvasToTempFilePath({
					canvasId: "qrcode-canvas",
					width: size,
					height: size,
					success: (res: any) => {
						resolve(res.tempFilePath);
					},
					fail: reject,
				});
			});
			// #endif
		} catch (e) {
			reject(e);
		}
	});
	// #endif

	return result;
}