<template>
	<page-wrapper>
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}  患者：${query.name || '-'}`" size="small" color="#666" />
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>

		<view v-else-if="list.length > 0">
			<up-card v-for="item in list" :key="item.id" :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text :text="`第 ${item.analysisCount || 1} 次分析`" bold size="medium" />
						<up-text :text="formatDate(item.analysisDate)" size="small" color="info" />
					</view>
				</template>
				<template #body>
					<!-- 患者信息 -->
					<up-text text="样本信息" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="身高" size="small" color="info" />
							<up-text :text="formatVal(item.height, ' cm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="体重" size="small" color="info" />
							<up-text :text="formatVal(item.weight, ' kg')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="BMI" size="small" color="info" />
							<up-text :text="formatVal(item.bmi)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="结石部位" size="small" color="info" />
							<up-text :text="item.stoneLocation || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="分析方法" size="small" color="info" />
							<up-text :text="item.analysisMethod || '-'" size="small" />
						</view>
					</view>

					<!-- 成分组成 -->
					<up-text text="成分组成" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="component-list">
						<view
							v-for="(c, idx) in getComponents(item)"
							:key="idx"
							class="component-row"
						>
							<view class="component-row__head">
								<view class="component-row__name">
									<up-text :text="`成分 ${idx + 1}`" size="small" color="info" />
									<up-text :text="c.name" bold size="medium" />
								</view>
								<up-text :text="`${c.percent}%`" size="medium" :color="getPercentColor(c.percent)" />
							</view>
							<view class="component-row__bar">
								<view class="component-row__bar-fill" :style="{ width: c.percent + '%', background: getPercentColor(c.percent) }"></view>
							</view>
						</view>
						<view v-if="getComponents(item).length === 0" class="empty-inline">
							<up-text text="暂无成分数据" color="info" />
						</view>
					</view>

					<view v-if="item.remark" class="remark">
						<up-text text="备注" size="small" color="info" />
						<up-text :text="item.remark" size="small" block />
					</view>

					<view class="info-grid" style="margin-top: 16rpx;">
						<view class="info-item">
							<up-text text="录入人" size="small" color="info" />
							<up-text :text="item.operator || '-'" size="small" />
						</view>
					</view>
				</template>
			</up-card>
		</view>

		<view v-else class="empty-state">
			<up-text text="暂无结石成分数据" color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { service } from "@/composables/useService";
import { logger } from "@/utils/logger";

interface ComponentItem {
	id: number;
	swlNo: string;
	serialNumber: string;
	analysisCount?: number;
	analysisDate?: string;
	height?: number;
	weight?: number;
	bmi?: number;
	stoneLocation?: string;
	analysisMethod?: string;
	component1?: string;
	component1Percent?: number;
	component2?: string;
	component2Percent?: number;
	component3?: string;
	component3Percent?: number;
	component4?: string;
	component4Percent?: number;
	remark?: string;
	operator?: string;
	[key: string]: any;
}

const query = ref<Record<string, string>>({});
const list = ref<ComponentItem[]>([]);
const loading = ref(false);

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

/** 提取 4 个成分项 */
function getComponents(item: ComponentItem) {
	const out: { name: string; percent: number }[] = [];
	const cs = [
		{ name: item.component1, percent: item.component1Percent },
		{ name: item.component2, percent: item.component2Percent },
		{ name: item.component3, percent: item.component3Percent },
		{ name: item.component4, percent: item.component4Percent },
	];
	for (const c of cs) {
		if (c.name) {
			out.push({ name: c.name, percent: Number(c.percent) || 0 });
		}
	}
	return out;
}

/** 颜色梯度：百分比越高越深 */
function getPercentColor(percent: number) {
	if (percent >= 70) return "#ff5e8a";
	if (percent >= 40) return "#ff9500";
	if (percent >= 20) return "#2979ff";
	return "#909193";
}

function formatVal(v?: number | string | null, unit = "") {
	if (v === null || v === undefined || v === "") return "-";
	return `${v}${unit}`;
}

function formatDate(v?: string | Date) {
	if (!v) return "";
	try {
		const d = typeof v === "string" ? new Date(v) : v;
		if (isNaN(d.getTime())) return String(v);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {
		return String(v);
	}
}

async function loadList() {
	const { swlNo, serialNumber } = query.value;
	if (!swlNo) {
		uni.showToast({ title: "缺少碎石号", icon: "none" });
		return;
	}
	loading.value = true;
	try {
		const res = await service.swl.composition.findBySwlNo({
			swlNo,
			serialNumber,
		});
		logger.log("composition res", res);
		list.value = Array.isArray(res) ? res : [];
	} catch (error: any) {
		logger.error("加载结石成分失败:", error);
		uni.showToast({ title: error.message || "加载失败", icon: "none" });
		list.value = [];
	} finally {
		loading.value = false;
	}
}

loadList();
</script>

<style lang="scss" scoped>
.info-bar {
	padding: 16rpx 24rpx;
	background: #fff;
}

.card-head {
	display: flex;
	justify-content: space-between;
	align-items: center;
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

.component-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.component-row {
	&__head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8rpx;
	}

	&__name {
		display: flex;
		flex-direction: column;
		gap: 2rpx;
	}

	&__bar {
		width: 100%;
		height: 12rpx;
		background: #f0f0f0;
		border-radius: 6rpx;
		overflow: hidden;
	}

	&__bar-fill {
		height: 100%;
		transition: width 0.3s ease;
	}
}

.remark {
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.empty-inline,
.empty-state,
.loading-state {
	padding: 40rpx 0;
	text-align: center;
}
</style>
