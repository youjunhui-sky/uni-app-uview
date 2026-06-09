<template>
	<view v-if="showUpdate" class="version-check">
		<view class="version-check__content">
			<text class="version-check__title">发现新版本</text>
			<text class="version-check__desc">请刷新页面获取最新内容</text>
			<view class="version-check__actions">
				<button class="version-check__btn" @tap="refreshPage">立即刷新</button>
				<button class="version-check__btn version-check__btn--cancel" @tap="hideUpdate">
					稍后再说
				</button>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";

const showUpdate = ref(false);
const currentVersion = ref("");

/**
 * 检查版本更新
 */
async function checkVersion() {
	try {
		// 使用 uni.request 获取当前版本（兼容所有平台）
		const response = await new Promise<string>((resolve, reject) => {
			uni.request({
				url: "/version.txt?_t=" + Date.now(),
				method: "GET",
				success: (res) => {
					if (res.statusCode === 200) {
						// 处理响应数据：可能是字符串或对象
						let version = "";
						if (typeof res.data === "string") {
							version = res.data.trim();
						} else if (res.data && typeof res.data === "object") {
							version = String(res.data).trim();
						}
						resolve(version);
					} else {
						reject(new Error(`请求失败，状态码: ${res.statusCode}`));
					}
				},
				fail: (err) => {
					reject(err);
				},
			});
		});

		const newVersion = response;

		// 获取本地存储的版本
		const localVersion = uni.getStorageSync("app_version") || "";

		console.log("newVersion", newVersion);
		console.log("localVersion", localVersion);

		console.log("newVersion !== localVersion", newVersion !== localVersion);

		// 如果是第一次访问或者版本不同，则更新本地存储的版本
		if (newVersion && newVersion !== localVersion) {
			// 如果本地没有版本信息，说明是第一次访问，直接保存版本
			if (!localVersion) {
				uni.setStorageSync("app_version", newVersion);
				console.log("首次访问，保存版本:", newVersion);
			} else {
				// 版本不同，显示更新提示
				currentVersion.value = newVersion;
				showUpdate.value = true;
			}
		}
	} catch (error) {
		console.log("版本检查失败:", error);
	}
}

/**
 * 刷新页面
 */
function refreshPage() {
	// 保存新版本到本地存储
	if (currentVersion.value) {
		uni.setStorageSync("app_version", currentVersion.value);
		console.log("保存新版本到本地:", currentVersion.value);
	}

	// 清理其他缓存（保留版本信息）
	const version = uni.getStorageSync("app_version");
	uni.clearStorageSync();
	if (version) {
		uni.setStorageSync("app_version", version);
	}

	// 强制刷新
	uni.reLaunch({
		url: "/pages/index/home",
	});
}

/**
 * 隐藏更新提示
 */
function hideUpdate() {
	showUpdate.value = false;
}

onMounted(() => {
	// 页面加载时检查版本
	checkVersion();

	// 定期检查版本（每10分钟）
	setInterval(checkVersion, 10 * 60 * 1000);
});

// 页面显示时也检查版本（处理从后台切回的情况）
onShow(() => {
	checkVersion();
});
</script>

<style lang="scss" scoped>
.version-check {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;

	&__content {
		background: #fff;
		border-radius: 16rpx;
		padding: 48rpx 32rpx;
		margin: 0 48rpx;
		text-align: center;
	}

	&__title {
		display: block;
		font-size: 32rpx;
		font-weight: 700;
		color: #333;
		margin-bottom: 16rpx;
	}

	&__desc {
		display: block;
		font-size: 26rpx;
		color: #666;
		margin-bottom: 32rpx;
	}

	&__actions {
		display: flex;
		gap: 24rpx;
	}

	&__btn {
		flex: 1;
		height: 72rpx;
		border-radius: 36rpx;
		font-size: 28rpx;
		border: none;

		&--cancel {
			background: #f5f5f5;
			color: #666;
		}

		&:not(.version-check__btn--cancel) {
			background: #007aff;
			color: #fff;
		}
	}
}
</style>
