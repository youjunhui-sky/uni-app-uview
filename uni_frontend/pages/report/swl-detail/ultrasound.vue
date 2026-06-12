<template>
	<page-wrapper>
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}`" size="small" color="#666" />
		</view>

		<view v-if="!loading">
			<!-- 报告摘要 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text text="报告摘要" bold size="medium" />
						<up-text :text="formatDate(detail.registerTime)" size="small" color="info" />
					</view>
				</template>
				<template #body>
					<!-- 检查类型 -->
					<view class="check-types">
						<up-text text="检查类型" size="small" color="info" />
						<view class="check-types__tags">
							<up-tag
								v-for="t in checkTypeTags"
								:key="t.key"
								:text="t.label"
								:type="t.has ? 'success' : 'info'"
								plain
								size="mini"
							/>
						</view>
					</view>

					<view class="summary-section" v-for="(group, idx) in summaryGroups" :key="idx">
						<up-text :text="group.title" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
						<view class="info-grid">
							<view v-for="f in group.fields" :key="f.key" class="info-item">
								<up-text :text="f.label" size="small" color="info" />
								<up-text :text="f.value || '-'" size="small" />
							</view>
						</view>
					</view>

					<view v-if="!hasAnyData" class="empty-inline">
						<up-text text="暂无检查数据" color="info" />
					</view>
				</template>
			</up-card>

			<!-- 影像图片 -->
			<up-card :border="false">
				<template #head>
					<up-text text="影像图片" bold size="medium" />
				</template>
				<template #body>
					<scroll-view
						v-if="imageList.length > 0"
						scroll-x
						class="image-scroll"
					>
						<view
							v-for="(img, idx) in imageList"
							:key="idx"
							class="image-item"
							@tap="previewImage(idx)"
						>
							<image :src="img" mode="aspectFill" class="image-thumb"></image>
						</view>
					</scroll-view>
					<view v-else class="empty-inline">
						<up-text text="暂无影像图片" color="info" />
					</view>
				</template>
			</up-card>
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { logger } from "@/utils/logger";

interface ImagingExamItem {
	id: number;
	swlNo: string;
	hasUltrasound?: number;
	hasKUB?: number;
	hasIVU?: number;
	hasCT?: number;
	hasMRI?: number;
	hasCTU?: number;
	ctValue?: number;
	leftKidneyStones?: string;
	rightKidneyStones?: string;
	leftUreterStones?: string;
	rightUreterStones?: string;
	bladderStones?: string;
	urethraStones?: string;
	leftKidneyHydronephrosis?: string;
	rightKidneyHydronephrosis?: string;
	imageUrls?: string;
	registerTime?: string;
	registrar?: string;
	[key: string]: any;
}

const query = ref<Record<string, string>>({});
const detail = ref<ImagingExamItem | null>(null);
const loading = ref(false);

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

/** 检查类型 tag */
const checkTypeTags = computed(() => {
	const d = detail.value;
	if (!d) return [];
	return [
		{ key: "us", label: "超声", has: d.hasUltrasound === 1 },
		{ key: "kub", label: "KUB", has: d.hasKUB === 1 },
		{ key: "ivu", label: "IVU", has: d.hasIVU === 1 },
		{ key: "ct", label: "CT", has: d.hasCT === 1 },
		{ key: "mri", label: "MRI", has: d.hasMRI === 1 },
		{ key: "ctu", label: "CTU", has: d.hasCTU === 1 },
	];
});

/** 摘要分组 */
const summaryGroups = computed(() => {
	const d = detail.value;
	if (!d) return [];
	return [
		{
			title: "左肾",
			fields: [
				{ key: "lks", label: "结石", value: d.leftKidneyStones },
				{ key: "lkh", label: "积水", value: d.leftKidneyHydronephrosis },
			],
		},
		{
			title: "右肾",
			fields: [
				{ key: "rks", label: "结石", value: d.rightKidneyStones },
				{ key: "rkh", label: "积水", value: d.rightKidneyHydronephrosis },
			],
		},
		{
			title: "输尿管",
			fields: [
				{ key: "lus", label: "左侧", value: d.leftUreterStones },
				{ key: "rus", label: "右侧", value: d.rightUreterStones },
			],
		},
		{
			title: "膀胱 / 尿道",
			fields: [
				{ key: "bs", label: "膀胱", value: d.bladderStones },
				{ key: "us", label: "尿道", value: d.urethraStones },
			],
		},
	];
});

/** 是否有任何摘要数据 */
const hasAnyData = computed(() => {
	const d = detail.value;
	if (!d) return false;
	return Boolean(
		d.leftKidneyStones ||
			d.rightKidneyStones ||
			d.leftUreterStones ||
			d.rightUreterStones ||
			d.bladderStones ||
			d.urethraStones ||
			d.ctValue,
	);
});

/** 图片列表（imageUrls 为逗号分隔的 URL） */
const imageList = computed(() => {
	const d = detail.value;
	if (!d || !d.imageUrls) return [];
	return d.imageUrls
		.split(/[,;]/)
		.map((s) => s.trim())
		.filter(Boolean);
});

function previewImage(index: number) {
	if (imageList.value.length === 0) return;
	uni.previewImage({
		urls: imageList.value,
		current: imageList.value[index],
	});
}

function formatDate(d?: string) {
	if (!d) return "-";
	return d;
}

async function loadDetail() {
	loading.value = true;
	try {
		// TODO: Step 4 后端就绪后替换为 service.swl.imaging.getBySwlNo
		// 当前使用 mock 数据演示 UI
		const { swlNo } = query.value;
		logger.log("loading imaging for swlNo:", swlNo);
		await new Promise((r) => setTimeout(r, 200));
		detail.value = {
			id: 1,
			swlNo: swlNo || "",
			hasUltrasound: 1,
			hasKUB: 1,
			hasIVU: 0,
			hasCT: 1,
			hasMRI: 0,
			hasCTU: 0,
			ctValue: 850,
			leftKidneyStones: "1 颗，长径 10mm",
			rightKidneyStones: "无",
			leftUreterStones: "无",
			rightUreterStones: "无",
			bladderStones: "无",
			urethraStones: "无",
			leftKidneyHydronephrosis: "轻度",
			rightKidneyHydronephrosis: "无",
			imageUrls: "",
			registerTime: "2024-06-01",
			registrar: "王医生",
		};
	} catch (error: any) {
		logger.error("加载超声报告失败:", error);
		detail.value = null;
	} finally {
		loading.value = false;
	}
}

loadDetail();
</script>

<style lang="scss" scoped>
.info-bar {
	padding: 16rpx 24rpx;
	background: #fff;
}

.card-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.check-types {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 20rpx;

	&__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}
}

.summary-section {
	padding: 16rpx 0;

	&:not(:last-child) {
		border-bottom: 1rpx solid #f0f0f0;
	}
}

.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12rpx 24rpx;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.empty-inline {
	padding: 40rpx 0;
	text-align: center;
}

.image-scroll {
	white-space: nowrap;
}

.image-item {
	display: inline-block;
	width: 240rpx;
	height: 240rpx;
	margin-right: 16rpx;
	border-radius: 12rpx;
	overflow: hidden;
	background: #f5f7fa;
}

.image-thumb {
	width: 100%;
	height: 100%;
}

.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
