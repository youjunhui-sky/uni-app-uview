<template>
	<!--
		使用 up-picker 的 hasInput=true 模式：
		- picker 内部自己渲染 up-input，点击 input 自动触发弹层
		- 弹层在 picker 自己的 u-popup 里弹出，无需外层包 popup
		- 通过 v-model 双向同步选中值（v-model 必须是数组）
		- 用 slot 自定义 input 的显示内容
	-->
	<up-picker
		:hasInput="true"
		:show="showPicker"
		:columns="columns"
		keyName="text"
		v-model="pickerValue"
		@change="onChange"
		@confirm="onConfirm"
		@cancel="onCancel"
	>
		<!-- 自定义 input 区域（替代 picker 默认的 up-input） -->
		<template #default="{ value }">
			<view class="single-select" @click="showPicker = true">
				<view class="single-select__input" :class="{ 'is-placeholder': !value }">
					<text class="single-select__text">{{ value || placeholder }}</text>
				</view>
				<view class="single-select__arrow"></view>
			</view>
		</template>
	</up-picker>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

interface Option {
	label: string;
	value: string | number;
}

interface Props {
	modelValue?: string | number;
	options?: Option[];
	placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	options: () => [],
	placeholder: "请选择",
});

const emit = defineEmits(["update:modelValue", "change"]);

const showPicker = ref(false);
const tempValue = ref<string | number>("");
const pickerValue = ref<any[]>([]);

// picker 显示在 input 上的文本：通过 modelValue 找到对应 label
const displayValue = computed(() => {
	const found = props.options.find((opt) => String(opt.value) === String(props.modelValue));
	return found ? found.label : "";
});

const columns = computed(() => {
	const list = props.options.map((opt) => ({
		text: String(opt.label),
		value: String(opt.value),
	}));
	return [list];
});

watch(
	() => props.modelValue,
	(val) => {
		tempValue.value = val;
		if (val !== "" && val !== null && val !== undefined) {
			pickerValue.value = [String(val)];
		} else {
			pickerValue.value = [];
		}
	},
	{ immediate: true }
);

const onCancel = () => {
	showPicker.value = false;
};

const onChange = (e: any) => {
	const { value } = e.detail || {};
	if (Array.isArray(value) && value.length > 0) {
		const item = value[0];
		if (item && typeof item === "object") {
			tempValue.value = item.value;
		} else {
			tempValue.value = item;
		}
	}
};

const onConfirm = (e: any) => {
	let selectedValue: any = "";
	if (e && Array.isArray(e.value) && e.value.length > 0) {
		const item = e.value[0];
		if (item && typeof item === "object") {
			selectedValue = item.value;
		} else {
			selectedValue = item;
		}
	} else {
		selectedValue = tempValue.value;
	}
	emit("update:modelValue", selectedValue);
	emit("change", selectedValue);
	showPicker.value = false;
};
</script>

<style lang="scss" scoped>
.single-select {
	position: relative;
	display: flex;
	align-items: center;
	width: 100%;
	min-height: 72rpx;
	cursor: pointer;
	background: #fff;
}

.single-select__input {
	flex: 1;
	min-height: 72rpx;
	padding: 0 60rpx 0 24rpx;
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #303133;
	border: 1rpx solid #dcdfe6;
	border-radius: 8rpx;
}

.single-select__input.is-placeholder .single-select__text {
	color: #c0c4cc;
}

.single-select__text {
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

// CSS 画的向下三角形箭头
.single-select__arrow {
	position: absolute;
	right: 8rpx;
	top: 50%;
	width: 0;
	height: 0;
	transform: translateY(-25%);
	border-left: 10rpx solid transparent;
	border-right: 10rpx solid transparent;
	border-top: 12rpx solid #999;
	pointer-events: none;
}
</style>
