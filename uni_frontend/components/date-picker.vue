<template>
	<view class="date-picker">
		<up-input
			:value="displayValue"
			:placeholder="placeholder"
			readonly
			@click="openPicker"
		/>
		<up-popup :show="showPopup" mode="bottom" @close="closePicker">
			<view class="picker-header">
				<text @click="cancel">取消</text>
				<text @click="confirm">确定</text>
			</view>
			<up-picker
				:columns="columns"
				@change="onChange"
			/>
		</up-popup>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Props {
	modelValue?: string | number;
	placeholder?: string;
	format?: string;
	startYear?: number;
	endYear?: number;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	placeholder: "请选择日期",
	format: "YYYY-MM-DD",
	startYear: 1900,
	endYear: 2100,
});

const emit = defineEmits(["update:modelValue", "change"]);

const showPopup = ref(false);
const tempValue = ref<any>({});

// 生成年份数组
const years = computed(() => {
	const arr = [];
	for (let i = props.startYear; i <= props.endYear; i++) {
		arr.push(String(i));
	}
	return arr;
});

// 生成月份数组
const months = computed(() => {
	const arr = [];
	for (let i = 1; i <= 12; i++) {
		arr.push(String(i).padStart(2, "0"));
	}
	return arr;
});

// 生成日期数组
const days = computed(() => {
	const arr = [];
	for (let i = 1; i <= 31; i++) {
		arr.push(String(i).padStart(2, "0"));
	}
	return arr;
});

const columns = computed(() => [
	{ values: years.value },
	{ values: months.value },
	{ values: days.value },
]);

// 显示值
const displayValue = computed(() => {
	if (!props.modelValue) return "";
	return String(props.modelValue);
});

// 初始化默认值
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			const parts = String(val).split("-");
			if (parts.length >= 3) {
				tempValue.value = {
					year: parts[0],
					month: parts[1],
					day: parts[2],
				};
			}
		}
	},
	{ immediate: true }
);

const openPicker = () => {
	showPopup.value = true;
};

const closePicker = () => {
	showPopup.value = false;
};

const cancel = () => {
	closePicker();
};

const onChange = (e: any) => {
	const { values } = e.detail;
	tempValue.value = {
		year: values[0],
		month: values[1],
		day: values[2],
	};
};

const confirm = () => {
	const { year, month, day } = tempValue.value;
	const result = `${year}-${month}-${day}`;
	emit("update:modelValue", result);
	emit("change", result);
	closePicker();
};
</script>

<style lang="scss" scoped>
.date-picker {
	width: 100%;
}

.picker-header {
	display: flex;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	border-bottom: 1rpx solid #eee;

	text {
		font-size: 28rpx;
		color: #666;

		&:last-child {
			color: $u-primary;
		}
	}
}
</style>