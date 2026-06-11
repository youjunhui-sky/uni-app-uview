import UQRCode from "uqrcodejs";

/**
 * 生成二维码（返回 base64 图片字符串）
 */
export async function generateQRCode(text: string, width = 200, height = 200): Promise<string> {
	// #ifdef H5
	return new Promise((resolve, reject) => {
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

			// 手动渲染 QR 码矩阵到 canvas，避免 drawCanvas 回调时序问题
			const moduleCount = (qr as any).moduleCount as number;
			const modules = (qr as any).modules as Array<Array<{ isBlack: boolean }>>;
			const moduleSize = size / moduleCount;

			// 白色背景
			ctx.fillStyle = "#FFFFFF";
			ctx.fillRect(0, 0, size, size);

			// 逐个模块绘制
			ctx.fillStyle = "#000000";
			for (let row = 0; row < moduleCount; row++) {
				for (let col = 0; col < moduleCount; col++) {
					if (modules[row]?.[col]?.isBlack) {
						ctx.fillRect(
							Math.floor(col * moduleSize),
							Math.floor(row * moduleSize),
							Math.ceil(moduleSize),
							Math.ceil(moduleSize),
						);
					}
				}
			}

			const dataUrl = canvas.toDataURL("image/png");
			resolve(dataUrl);
		} catch (e) {
			reject(e);
		}
	});
	// #endif

	// #ifndef H5
	return new Promise((resolve, reject) => {
		uni.request({
			url: "https://api.uomg.com/api/qrcode",
			data: { text, width, height },
			success: (res: any) => {
				if (res.data.code === 1) {
					resolve(res.data.data);
				} else {
					reject(new Error(res.data.msg || "生成二维码失败"));
				}
			},
			fail: reject,
		});
	});
	// #endif
}