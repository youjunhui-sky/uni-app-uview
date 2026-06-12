<template>
	<page-wrapper>
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}`" size="small" color="#666" />
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>

		<!-- 时间轴 -->
		<view v-else-if="list.length > 0" class="timeline">
			<view v-for="(item, idx) in list" :key="item.id" class="timeline__node">
				<view class="timeline__axis">
					<view class="timeline__dot" :class="{ 'timeline__dot--latest': idx === 0 }">
						<view v-if="idx === 0" class="timeline__dot-inner"></view>
					</view>
					<view v-if="idx < list.length - 1" class="timeline__line"></view>
				</view>
				<view class="timeline__content">
					<view class="timeline__time">
						<up-text :text="formatDate(item.treatmentTime) || '-'" bold size="medium" />
						<up-tag :text="`第 ${item.episode} 期 / 序列 ${item.sequenceNo}`" type="primary" size="mini" />
					</view>
					<up-card :border="false" :customStyle="{ marginTop: '12rpx' }">
						<template #body>
							<!-- 1. 术前诊断 -->
							<up-text text="术前信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="info-grid">
								<view class="info-item">
									<up-text text="术前诊断" size="small" color="info" />
									<up-text :text="item.preopDiagnosis || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="术前辅助治疗" size="small" color="info" />
									<up-text :text="item.preopTherapy || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="术前准备措施" size="small" color="info" />
									<up-text :text="item.preopPreparation || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="支架管类型" size="small" color="info" />
									<up-text :text="item.stentType || '-'" size="small" />
								</view>
							</view>

							<!-- 2. 结石部位 1 -->
							<view class="section-divider"></view>
							<up-text text="结石部位 1" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="info-grid">
								<view class="info-item">
									<up-text text="位置（左右）" size="small" color="info" />
									<up-text :text="item.position1 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="具体位置" size="small" color="info" />
									<up-text :text="item.location1 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="治疗深度" size="small" color="info" />
									<up-text :text="item.depth1 ? item.depth1 + ' cm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石长径" size="small" color="info" />
									<up-text :text="item.stoneSizeFront1 ? item.stoneSizeFront1 + ' mm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石宽径" size="small" color="info" />
									<up-text :text="item.stoneSizeBack1 ? item.stoneSizeBack1 + ' mm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石表面积" size="small" color="info" />
									<up-text :text="item.stoneArea1 ? item.stoneArea1 + ' mm²' : '-'" size="small" />
								</view>
							</view>

							<!-- 3. 结石部位 2 -->
							<view class="section-divider"></view>
							<up-text text="结石部位 2" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="info-grid">
								<view class="info-item">
									<up-text text="位置（左右）" size="small" color="info" />
									<up-text :text="item.position2 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="具体位置" size="small" color="info" />
									<up-text :text="item.location2 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="治疗深度" size="small" color="info" />
									<up-text :text="item.depth2 ? item.depth2 + ' cm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石长径" size="small" color="info" />
									<up-text :text="item.stoneSizeFront2 ? item.stoneSizeFront2 + ' mm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石宽径" size="small" color="info" />
									<up-text :text="item.stoneSizeBack2 ? item.stoneSizeBack2 + ' mm' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石表面积" size="small" color="info" />
									<up-text :text="item.stoneArea2 ? item.stoneArea2 + ' mm²' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="受治疗结石数目" size="small" color="info" />
									<up-text :text="item.stoneCount ?? '-'" size="small" />
								</view>
							</view>

							<!-- 4. 设备与参数 -->
							<view class="section-divider"></view>
							<up-text text="设备与参数" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="info-grid">
								<view class="info-item">
									<up-text text="主要机型" size="small" color="info" />
									<up-text :text="item.machine1 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="辅助机型" size="small" color="info" />
									<up-text :text="item.machine2 || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="治疗体位" size="small" color="info" />
									<up-text :text="item.bodyPosition || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="定位方式" size="small" color="info" />
									<up-text :text="item.targetingMethod || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="治疗电压" size="small" color="info" />
									<up-text :text="item.voltage ? item.voltage + ' kV' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="冲击次数" size="small" color="info" />
									<up-text :text="item.shockwaveCount || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="透视 KV 值" size="small" color="info" />
									<up-text :text="item.fluoroscopyKV || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="脉冲频率" size="small" color="info" />
									<up-text :text="item.pulseRate ? item.pulseRate + ' 次/分' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石反应" size="small" color="info" />
									<up-text :text="item.stoneResponse || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="MA 值" size="small" color="info" />
									<up-text :text="item.maValue || '-'" size="small" />
								</view>
							</view>

							<!-- 5. 不良反应 -->
							<view class="section-divider"></view>
							<up-text text="不良反应" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="adverse-tags">
								<up-tag
									v-for="ad in adverseTags(item)"
									:key="ad.key"
									:text="ad.label"
									:type="ad.has ? 'error' : 'info'"
									plain
									size="mini"
								/>
							</view>
							<view class="info-grid" style="margin-top: 16rpx;">
								<view class="info-item">
									<up-text text="疼痛指数" size="small" color="info" />
									<up-text :text="item.painScore || '-'" size="small" />
								</view>
							</view>

							<!-- 6. 术中信息 -->
							<view class="section-divider"></view>
							<up-text text="术中信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
							<view class="info-grid">
								<view class="info-item" style="grid-column: span 2;">
									<up-text text="术中处理措施" size="small" color="info" />
									<up-text :text="item.intraopManagement || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="主治医生" size="small" color="info" />
									<up-text :text="item.doctor || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="治疗费用" size="small" color="info" />
									<up-text :text="item.treatmentCost ? '¥' + item.treatmentCost : '-'" size="small" />
								</view>
							</view>

							<!-- 7. 影像（仅显示 URL 列表） -->
							<view v-if="item.preopImages || item.postopImages" class="section-divider"></view>
							<view v-if="item.preopImages || item.postopImages">
								<up-text text="影像资料" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
								<view v-if="item.preopImages" class="image-list">
									<up-text text="术前影像：" size="small" color="info" />
									<up-text :text="item.preopImages" size="small" />
								</view>
								<view v-if="item.postopImages" class="image-list">
									<up-text text="术后影像：" size="small" color="info" />
									<up-text :text="item.postopImages" size="small" />
								</view>
							</view>
						</template>
					</up-card>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<up-text text="暂无治疗记录" color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { service } from "@/composables/useService";
import { logger } from "@/utils/logger";

interface TreatmentItem {
	id: number;
	swlNo: string;
	serialNumber: string;
	sequenceNo: number;
	episode: number;
	preopDiagnosis?: string;
	position1?: string;
	location1?: string;
	depth1?: string;
	stoneSizeFront1?: number;
	stoneSizeBack1?: number;
	stoneArea1?: number;
	position2?: string;
	location2?: string;
	depth2?: string;
	stoneSizeFront2?: number;
	stoneSizeBack2?: number;
	stoneArea2?: number;
	stoneCount?: number;
	preopTherapy?: string;
	preopPreparation?: string;
	stentType?: string;
	machine1?: string;
	machine2?: string;
	bodyPosition?: string;
	targetingMethod?: string;
	voltage?: string;
	shockwaveCount?: string;
	fluoroscopyKV?: string;
	pulseRate?: string;
	stoneResponse?: string;
	maValue?: string;
	noAdverseReaction?: number;
	hasSkinBleeding?: number;
	hasNausea?: number;
	hasRadiationPain?: number;
	otherAdverseReaction?: number;
	painScore?: string;
	preopImages?: string;
	postopImages?: string;
	intraopManagement?: string;
	doctor?: string;
	treatmentCost?: number;
	treatmentTime?: string;
	[key: string]: any;
}

const query = ref<Record<string, string>>({});
const list = ref<TreatmentItem[]>([]);
const loading = ref(false);

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

/** 不良反应 tag 列表 */
function adverseTags(item: TreatmentItem) {
	return [
		{ key: "no", label: "无不良反应", has: item.noAdverseReaction === 1 },
		{ key: "skin", label: "皮肤渗血/瘀斑", has: item.hasSkinBleeding === 1 },
		{ key: "nausea", label: "恶心呕吐", has: item.hasNausea === 1 },
		{ key: "radiation", label: "放射痛", has: item.hasRadiationPain === 1 },
		{ key: "other", label: "其他", has: item.otherAdverseReaction === 1 },
	];
}

function formatDate(v?: string | Date) {
	if (!v) return "";
	try {
		const d = typeof v === "string" ? new Date(v) : v;
		if (isNaN(d.getTime())) return String(v);
		const y = d.getFullYear();
		const m = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		const hh = String(d.getHours()).padStart(2, "0");
		const mm = String(d.getMinutes()).padStart(2, "0");
		return `${y}-${m}-${day} ${hh}:${mm}`;
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
		const res = await service.swl.treatment.findBySwlNo({
			swlNo,
			serialNumber,
		});
		logger.log("treatment res", res);
		list.value = Array.isArray(res) ? res : [];
	} catch (error: any) {
		logger.error("加载治疗记录失败:", error);
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

.timeline {
	padding: 0 24rpx 24rpx;

	&__node {
		display: flex;
	}

	&__axis {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 20rpx;
		padding-top: 16rpx;
	}

	&__dot {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;
		background: #c0c4cc;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	&__dot--latest {
		background: #2979ff;
		box-shadow: 0 0 0 6rpx rgba(41, 121, 255, 0.2);
	}

	&__dot-inner {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: #fff;
	}

	&__line {
		flex: 1;
		width: 2rpx;
		background: #e4e7ed;
		margin-top: 4rpx;
		min-height: 40rpx;
	}

	&__content {
		flex: 1;
		padding-bottom: 32rpx;
	}

	&__time {
		display: flex;
		align-items: center;
		gap: 12rpx;
		padding-top: 8rpx;
	}
}

.info-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16rpx 24rpx;
}

.info-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.section-divider {
	height: 1rpx;
	background: #f0f0f0;
	margin: 20rpx 0;
}

.adverse-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.image-list {
	padding: 8rpx 0;
	word-break: break-all;
}

.empty-state,
.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
