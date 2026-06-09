import { defineStore } from "pinia";
import { computed, reactive, toRaw } from "vue";
import { service } from "@/composables/useService";
import { isDev } from "@/config";
import { isString } from "lodash-es";
import { deepTree, isEmpty } from "@/utils/comm";

export interface DictItem {
	id: string;
	label: string;
	value: any;
	children?: DictItem[];
	[key: string]: any;
}

export interface DictData {
	[key: string]: DictItem[];
}

const useDictStore = defineStore("dict", () => {
	// 对象数据
	const data = reactive<DictData>({});

	// 获取数据列表
	function get(name: string) {
		return computed(() => data[name]).value || [];
	}

	// 获取名称
	function getLabel(name: string | DictItem[], value: any): string {
		const arr: any[] = String(value)?.split(",") || [];

		return arr
			.map((e) => {
				return (isString(name) ? get(name) : name).find((a) => a.value == e)?.label;
			})
			.filter(Boolean)
			.join(",");
	}

	// 刷新
	async function refresh(types?: string[]) {
		return service.dict.info
			.data({
				types,
			})
			.then((res: DictData) => {
				const d: any = {};

				for (const [i, arr] of Object.entries(res)) {
					(arr as any[]).forEach((e) => {
						e.label = e.name;
						e.value = isEmpty(e.value) ? e.id : e.value;
					});

					d[i] = deepTree(arr, "desc");
				}

				Object.assign(data, d);

				if (isDev) {
					console.log("字典数据：");
					console.log(toRaw(data));
				}

				return data;
			});
	}

	return {
		data,
		get,
		getLabel,
		refresh,
	};
});

export { useDictStore };