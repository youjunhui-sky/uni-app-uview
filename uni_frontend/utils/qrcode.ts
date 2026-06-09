/**
 * 生成二维码
 */
export async function generateQRCode(text: string, width = 200, height = 200): Promise<string> {
	return new Promise((resolve, reject) => {
		// #ifdef H5
		try {
			// 使用 uQRCode 在 H5 环境生成二维码
			const qr = uni.createCanvasContext("qrcode-canvas");
			// 简单的二维码生成实现
			// 实际项目中可能需要使用专门的二维码库
			// 这里返回空字符串，实际使用时替换为真实实现
			resolve("");
		} catch (e) {
			reject(e);
		}
		// #endif

		// #ifndef H5
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
		// #endif
	});
}