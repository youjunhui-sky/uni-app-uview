import { isDev } from "@/config";
import { logger } from "@/utils/logger";

// 全局 token 存储
let globalToken = "";

// 设置 token
export function setGlobalToken(token: string) {
	globalToken = token;
}

// 获取 token
export function getGlobalToken() {
	return globalToken;
}

// 创建请求函数
function createRequest() {
	return function request(options: any): Promise<any> {
		// 每次调用时动态读取 globalToken
		let Authorization = globalToken;

		// 忽略标识（不需要 token 的接口）
		const ignoreTokenPaths = ["/app/user/login/phone", "/app/user/login/smsCode", "/app/user/login/captcha", "/app/user/login/refreshToken"];
		ignoreTokenPaths.forEach((e: string) => {
			if (options.url?.includes(e)) {
				Authorization = "";
			}
		});

		logger.log(`[${options.method || "GET"}] ${options.url}`);

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
						logger.log(`[响应] ${options.url} status=${res.statusCode}`);
						const { code, data, message } = res.data as any;

						if (res.statusCode === 401) {
							// 退出登录
							setGlobalToken("");
							return reject({ message });
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
						logger.error(`请求失败: ${options.url}`, err);
						reject({ message: err.errMsg });
					},
				});
			}

			next();
		});
	};
}

// 获取 baseUrl
function getBaseUrl() {
	return isDev ? "/dev" : "/api";
}

export interface Service {
	request: (options: any) => Promise<any>;
	user: UserService;
	patient: PatientService;
	questionnaire: QuestionnaireService;
	etiology: EtiologyService;
	swl: SwlService;
	dict: DictService;
	base: BaseService;
}

export interface UserService {
	login: {
		phone: (data: any) => Promise<any>;
		smsCode: (data: any) => Promise<any>;
		captcha: (data: any) => Promise<any>;
		refreshToken: (data: any) => Promise<any>;
		[key: string]: (data: any) => Promise<any>;
	};
	info: {
		person: () => Promise<any>;
		updatePerson: (data: any) => Promise<any>;
	};
	comm: {
		wxMpConfig: (data: any) => Promise<any>;
	};
}

export interface PatientService {
	patientUser: {
		getByUserId: (data: any) => Promise<any>;
		getCurrentPatient: (data: any) => Promise<any>;
		getByUserIdAndPatientNo: (data: any) => Promise<any>;
		addPatientUser: (data: any) => Promise<any>;
		updateDefault: (data: any) => Promise<any>;
		delete: (data: any) => Promise<any>;
	};
	patientInfo: {
		update: (data: any) => Promise<any>;
		getByIdCardAndName: (data: any) => Promise<any>;
	};
	info: {
		page: (data: any) => Promise<any>;
		info: (params: any) => Promise<any>;
	};
	questionnaire: {
		getQuestionnaireAnswerByPatientNoAndQuestionnaireId: (data: any) => Promise<any>;
		submitQuestionnaireAnswer: (data: any) => Promise<any>;
	};
}

export interface QuestionnaireService {
	questionnaire: {
		questionsWithOptions: () => Promise<any>;
	};
}

export interface EtiologyService {
	muaInfo: {
		getMuaInfoByPatientNo: (data: any) => Promise<any>;
		getMuaContentByPatientNoAndSwlNo: (data: any) => Promise<any>;
	};
}

export interface SwlService {
	register: {
		getByPatientNo: (data: any) => Promise<any>;
		getById: (id: number) => Promise<any>;
	};
	treatment: {
		findBySwlNo: (data: { swlNo: string; serialNumber?: string; episode?: number }) => Promise<any>;
		findById: (id: number) => Promise<any>;
	};
	imaging: {
		findBySwlNo: (data: { swlNo: string; serialNumber?: string }) => Promise<any>;
		findById: (id: number) => Promise<any>;
	};
}

export interface DictService {
	info: {
		data: (data: any) => Promise<any>;
	};
}

export interface BaseService {
	comm: {
		uploadMode: () => Promise<any>;
		upload: (data: any) => Promise<any>;
		param: (params: any) => Promise<any>;
	};
}

// 创建 request 实例
const request = createRequest();

// 创建 service 实例
export const service = {
	request,

	user: {
		login: {
			phone: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/login/phone",
					method: "POST",
					data,
				}),
			smsCode: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/login/smsCode",
					method: "POST",
					data,
				}),
			captcha: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/login/captcha",
					method: "GET",
					data,
				}),
			refreshToken: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/login/refreshToken",
					method: "POST",
					data,
				}),
		},
		info: {
			person: () =>
				request({
					url: getBaseUrl() + "/app/user/info/person",
					method: "GET",
				}),
			updatePerson: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/info/updatePerson",
					method: "POST",
					data,
				}),
		},
		comm: {
			wxMpConfig: (data: any) =>
				request({
					url: getBaseUrl() + "/app/user/comm/wxMpConfig",
					method: "GET",
					data,
				}),
		},
	},

	patient: {
		patientUser: {
			getByUserId: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/getByUserId",
					method: "POST",
					data,
				}),
			getCurrentPatient: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/getCurrentPatient",
					method: "POST",
					data,
				}),
			getByUserIdAndPatientNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/getByUserIdAndPatientNo",
					method: "POST",
					data,
				}),
			addPatientUser: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/addPatientUser",
					method: "POST",
					data,
				}),
			updateDefault: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/updateDefault",
					method: "POST",
					data,
				}),
			delete: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientUser/delete",
					method: "POST",
					data,
				}),
		},
		patientInfo: {
			update: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientInfo/update",
					method: "POST",
					data,
				}),
			getByIdCardAndName: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/patientInfo/getByIdCardAndName",
					method: "POST",
					data,
				}),
		},
		questionnaire: {
			getAnswer: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/questionnaire/getAnswer",
					method: "POST",
					data,
				}),
			submitAnswer: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/questionnaire/submitAnswer",
					method: "POST",
					data,
				}),
		},
		info: {
			page: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/info/page",
					method: "POST",
					data,
				}),
			info: (params: any) =>
				request({
					url: getBaseUrl() + "/app/patient/info/info",
					method: "GET",
					data: params,
				}),
		},
		questionnaire: {
			getAnswer: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/questionnaire/getAnswer",
					method: "POST",
					data,
				}),
			submitAnswer: (data: any) =>
				request({
					url: getBaseUrl() + "/app/patient/questionnaire/submitAnswer",
					method: "POST",
					data,
				}),
		},
	},

	questionnaire: {
		questionnaire: {
			questionsWithOptions: () =>
				request({
					url: getBaseUrl() + "/app/questionnaire/questionnaire/questionsWithOptions",
					method: "POST",
				}),
		},
	},

	etiology: {
		muaInfo: {
			getMuaInfoByPatientNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/etiology/muaInfo/getMuaInfoByPatientNo",
					method: "POST",
					data,
				}),
			getMuaContentByPatientNoAndSwlNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo",
					method: "POST",
					data,
				}),
		},
	},

	swl: {
		register: {
			getByPatientNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/swl/register/getByPatientNo",
					method: "POST",
					data,
				}),
			getById: (id: number) =>
				request({
					url: getBaseUrl() + `/app/swl/register/${id}`,
					method: "GET",
				}),
		},
		treatment: {
			findBySwlNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/swl/treatment/findBySwlNo",
					method: "POST",
					data,
				}),
			findById: (id: number) =>
				request({
					url: getBaseUrl() + `/app/swl/treatment/${id}`,
					method: "GET",
				}),
		},
		imaging: {
			findBySwlNo: (data: any) =>
				request({
					url: getBaseUrl() + "/app/swl/imaging/findBySwlNo",
					method: "POST",
					data,
				}),
			findById: (id: number) =>
				request({
					url: getBaseUrl() + `/app/swl/imaging/${id}`,
					method: "GET",
				}),
		},
	},

	dict: {
		info: {
			data: (data: any) =>
				request({
					url: getBaseUrl() + "/app/dict/info/data",
					method: "POST",
					data,
				}),
		},
	},

	base: {
		comm: {
			uploadMode: () =>
				request({
					url: getBaseUrl() + "/app/base/comm/uploadMode",
					method: "GET",
				}),
			upload: (data: any) =>
				request({
					url: getBaseUrl() + "/app/base/comm/upload",
					method: "POST",
					data,
				}),
			param: (params: any) =>
				request({
					url: getBaseUrl() + "/app/base/comm/param",
					method: "GET",
					data: params,
				}),
		},
	},
};