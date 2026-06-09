<template>
	<view class="otp-input-wrapper">
		<view class="otp-inputs">
			<input
				v-for="(item, index) in length"
				:key="index"
				:class="['otp-input-item', { 'is-focus': focusIndex === index }]"
				type="number"
				:disabled="disabled"
				:value="codeArray[index] || ''"
				maxlength="1"
				data-index="index"
				@focus="onFocus(index)"
				@blur="onBlur"
				@input="onInput($event, index)"
				@keydown="onKeyDown($event, index)"
			/>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

interface Props {
	modelValue?: string;
	length?: number;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: "",
	length: 4,
	disabled: false,
});

const emit = defineEmits(["update:modelValue", "finish"]);

const focusIndex = ref(0);
const codeArray = ref<string[]>([]);

// 初始化
const initCode = () => {
	codeArray.value = (props.modelValue || "").split("").slice(0, props.length);
	while (codeArray.value.length < props.length) {
		codeArray.value.push("");
	}
};

initCode();

const onFocus = (index: number) => {
	focusIndex.value = index;
};

const onBlur = () => {
	focusIndex.value = -1;
};

// 使用 uni.createSelectorQuery 获取下一个输入框并聚焦
const focusNextInput = (index: number) => {
	nextTick(() => {
		uni.createSelectorQuery()
			.selectAll(".otp-input-item")
			.fields({ id: true, node: true })
			.exec((res) => {
				const nodes = res[0];
				if (nodes && nodes[index] && nodes[index].id) {
					const query = uni.createSelectorQuery();
					query.select("#" + nodes[index].id).fields({ node: true, focus: true }).exec((args) => {
						if (args[0] && args[0].node) {
							args[0].node.focus?.();
						}
					});
				}
			});
	});
};

const onInput = (event: any, index: number) => {
	const value = event.detail?.value || "";
	const char = value.slice(-1);

	codeArray.value[index] = char;
	const finalValue = codeArray.value.join("");
	emit("update:modelValue", finalValue);

	// 自动聚焦下一个
	if (char && index < props.length - 1) {
		focusIndex.value = index + 1;
		focusNextInput(index + 1);
	}

	if (finalValue.length === props.length) {
		emit("finish", finalValue);
	}
};

const onKeyDown = (event: any, index: number) => {
	// 处理删除键
	if (event.detail.key === "Backspace" && !codeArray.value[index] && index > 0) {
		focusIndex.value = index - 1;
		focusNextInput(index - 1);
	}
};
</script>

<style lang="scss" scoped>
.otp-input-wrapper {
	display: flex;
	justify-content: center;
}

.otp-inputs {
	display: flex;
	gap: 16rpx;
}

.otp-input-item {
	width: 100rpx;
	height: 100rpx;
	border: 2rpx solid #dcdfe6;
	border-radius: 8rpx;
	text-align: center;
	font-size: 36rpx;
	background-color: #fff;

	&.is-focus {
		border-color: #3c9cff;
	}
}
</style>
