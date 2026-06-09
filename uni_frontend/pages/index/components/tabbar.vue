<template>
	<view class="tabbar-wrapper" :style="{ paddingBottom: 'env(safe-area-inset-bottom)' }">
		<view class="tabbar">
			<view
				class="item"
				v-for="(item, index) in list"
				:key="index"
				:class="{
					'is-active': item.active,
				}"
				@tap="toLink(item.pagePath)"
			>
				<view class="icon">
					<image :src="item.icon" mode="aspectFit" />
				</view>
				<text class="label">{{ item.text }}</text>
				<view class="badge" v-if="item.number > 0">{{ item.number || 0 }}</view>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useRouter } from "@/composables/useRouter";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

// TabBar 配置
const tabBarList = [
	{
		pagePath: "pages/index/home",
		text: "首页",
		iconPath: "static/icon/tabbar/home.png",
		selectedIconPath: "static/icon/tabbar/home2.png",
	},
	{
		pagePath: "pages/index/my",
		text: "我的",
		iconPath: "static/icon/tabbar/my.png",
		selectedIconPath: "static/icon/tabbar/my2.png",
	},
];

// 当前页面路径
const pagePath = ref(router.getPath());

const list = computed(() => {
	return tabBarList.map((e) => {
		const active = pagePath.value?.includes(e.pagePath);

		return {
			...e,
			icon: "/" + (active ? e.selectedIconPath : e.iconPath),
			active,
			number: 0,
			text: t(e.text?.replace(/%/g, "") || ""),
		};
	});
});

function toLink(pagePath: string) {
	const to = (link: string) => {
		// #ifdef H5
		location.href = link;
		// #endif

		// #ifdef APP-PLUS
		plus.runtime.openURL(link);
		// #endif
	};

	switch (pagePath) {
		case "cool":
			to("https://cool-js.com");
			break;

		case "admin":
			to("https://iulm.com.cn");
			break;

		default:
			router.push("/" + pagePath);
			break;
	}
}

uni.hideTabBar();
</script>

<style lang="scss" scoped>
$icon-size: 56rpx;

.tabbar-wrapper {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #fff;
	z-index: 399;
	border-top: 1rpx solid #eee;
}

.tabbar {
	display: flex;
	height: 120rpx;
	width: 100%;

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		position: relative;

		.icon {
			height: $icon-size;
			width: $icon-size;

			image {
				height: 100%;
				width: 100%;
			}
		}

		.label {
			font-size: 22rpx;
			color: #bfbfbf;
		}

		.badge {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 20rpx;
			transform: translateX(20rpx);
			font-size: 20rpx;
			height: 36rpx;
			min-width: 36rpx;
			padding: 0 6rpx;
			background-color: #f56c6c;
			border: 4rpx solid #fff;
			color: #fff;
			border-radius: 18rpx;
			font-weight: bold;
			box-sizing: border-box;
		}

		&.is-active {
			.label {
				color: $u-primary;
			}
		}
	}
}
</style>