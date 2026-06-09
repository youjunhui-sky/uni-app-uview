import dayjs from "dayjs";
import { service } from "./useService";
import { useUserStore } from "@/stores/user";
import { storage } from "./useStorage";
import { isDev } from "@/config";

declare interface UploadCallback {
	onProgressUpdate?(options: UniApp.OnProgressUpdateResult): void;
	onTask?(task: UniApp.UploadTask): void;
}

// 生成 uuid
function uuid(): string {
	const s: any[] = [];
	const hexDigits = "0123456789abcdef";
	for (let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4";
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	s[8] = s[13] = s[18] = s[23] = "-";
	return s.join("");
}

// 获取文件名
function basename(path: string): string {
	let index = path.lastIndexOf("/");
	index = index > -1 ? index : path.lastIndexOf("\\");
	if (index < 0) {
		return path;
	}
	return path.substring(index + 1);
}

// 路径拼接
function pathJoin(...parts: string[]): string {
	if (parts.length === 0) {
		return "";
	}
	const normalizedParts = parts.map((part) => part.replace(/(^\/+|\/+$)/g, ""));
	return normalizedParts.join("/");
}

export async function upload(file: any, cb?: UploadCallback): Promise<string> {
	const { onProgressUpdate, onTask } = cb || {};

	// 获取上传模式
	const { mode, type } = await service.base.comm.uploadMode();

	// 用户缓存
	const userStore = useUserStore();

	// 本地上传
	const isLocal = mode == "local";

	// 文件名
	const fileName = uuid() + "_" + (file.name || basename(file.path));

	// Key
	const key = isLocal ? fileName : pathJoin("app", dayjs().format("YYYY-MM-DD"), fileName);

	// 获取 baseUrl
	const baseUrl = isDev ? "/dev" : "/api";

	// 多种上传请求
	return new Promise((resolve, reject) => {
		// 上传文件
		function next({ host, preview, data }: { host: string; preview?: string; data?: any }) {
			// 签名数据
			const fd = {
				...data,
				key,
			};

			// 上传
			const task = uni.uploadFile({
				url: host,
				filePath: file.path,
				name: "file",
				header: isLocal
					? {
							Authorization: userStore.token,
					  }
					: {},
				formData: fd,
				success(res) {
					if (isLocal) {
						const { code, data, message } = JSON.parse(res.data);
						if (code == 1000) {
							resolve(data);
						} else {
							reject(message);
						}
					} else {
						resolve(pathJoin(preview || host, fd.key));
					}
				},
				fail(err) {
					reject(err);
				},
			});

			if (onTask) {
				onTask(task);
			}

			if (onProgressUpdate) {
				task.onProgressUpdate(onProgressUpdate);
			}
		}

		if (isLocal) {
			next({
				host: baseUrl + "/app/base/comm/upload",
			});
		} else {
			service.base.comm
				.upload(
					type == "aws"
						? {
								key,
						  }
						: {}
				)
				.then((res) => {
					switch (type) {
						// 腾讯
						case "cos":
							next({
								host: res.url,
								data: res.credentials,
							});
							break;
						// 阿里
						case "oss":
							next({
								host: res.host,
								data: {
									OSSAccessKeyId: res.OSSAccessKeyId,
									policy: res.policy,
									signature: res.signature,
								},
							});
							break;
						// 七牛
						case "qiniu":
							next({
								host: res.uploadUrl,
								preview: res.publicDomain,
								data: {
									token: res.token,
								},
							});
							break;
						// aws
						case "aws":
							next({
								host: res.url,
								data: res.fields,
							});
							break;
					}
				})
				.catch(reject);
		}
	});
}

export function useUpload() {
	return {
		upload,
	};
}