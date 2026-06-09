<template>
	<view class="agree-btn" @tap="toggle">
		<view class="checkbox" :class="{ checked: agree }"></view>
		<text class="label">
			已阅读并同意
			<text class="link" @tap.stop="toDoc('用户协议', 'userAgreement')">用户协议</text>
			和
			<text class="link" @tap.stop="toDoc('隐私政策', 'privacyPolicy')">隐私政策</text>
		</text>
	</view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "@/composables/useRouter";
import { useUi } from "@/composables/useUi";

const router = useRouter();
const ui = useUi();

const agree = ref(false);

function toggle() {
	agree.value = !agree.value;
}

function toDoc(title: string, key: string) {
	router.push({
		path: "/pages/user/doc",
		query: { title, key },
	});
}

function check() {
	if (!agree.value) {
		ui.showToast("请先勾选同意后再进行登录");
	}
	return agree.value;
}

defineExpose({ check });
</script>

<style lang="scss" scoped>
.agree-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20rpx;

	.checkbox {
		width: 36rpx;
		height: 36rpx;
		border: 2rpx solid #ccc;
		border-radius: 50%;
		margin-right: 10rpx;
		box-sizing: border-box;

		&.checked {
			background-color: #3c9cff;
			border-color: #3c9cff;
			position: relative;

			&::after {
				content: "✓";
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				color: #fff;
				font-size: 24rpx;
			}
		}
	}

	.label {
		color: #999;
		font-size: 24rpx;

		.link {
			color: #3c9cff;
			padding: 0 5rpx;
		}
	}
}
</style>