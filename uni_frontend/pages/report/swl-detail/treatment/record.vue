<template>
	<page-wrapper>
		<!-- 顶部信息条 -->
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}`" size="small" color="#666" />
		</view>

		<!-- 时间轴 -->
		<view v-if="list.length > 0" class="timeline">
			<view v-for="(item, idx) in list" :key="item.id" class="timeline__node">
				<!-- 左侧时间轴 -->
				<view class="timeline__axis">
					<view class="timeline__dot" :class="{ 'timeline__dot--latest': idx === 0 }">
						<view v-if="idx === 0" class="timeline__dot-inner"></view>
					</view>
					<view v-if="idx < list.length - 1" class="timeline__line"></view>
				</view>
				<!-- 右侧内容卡片 -->
				<view class="timeline__content">
					<view class="timeline__time">
						<up-text :text="item.treatmentTime" bold size="medium" />
						<up-tag :text="`第 ${item.episode} 期 / 第 ${item.sequenceNo} 次`" type="primary" size="mini" />
					</view>
					<up-card :border="false" :customStyle="{ marginTop: '12rpx' }">
						<template #body>
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
									<up-text text="脉冲频率" size="small" color="info" />
									<up-text :text="item.pulseRate ? item.pulseRate + ' 次/分' : '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="结石数目" size="small" color="info" />
									<up-text :text="item.stoneCount || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="主治医生" size="small" color="info" />
									<up-text :text="item.doctor || '-'" size="small" />
								</view>
								<view class="info-item">
									<up-text text="疼痛指数" size="small" color="info" />
									<up-text :text="item.painScore || '-'" size="small" />
								</view>
							</view>

							<!-- 不良反应 -->
							<view class="adverse">
								<up-text text="不良反应" size="small" color="info" />
								<view class="adverse__tags">
									<up-tag
										v-for="ad in getAdverseTags(item)"
										:key="ad.key"
										:text="ad.label"
										:type="ad.has ? 'error' : 'info'"
										plain
										size="mini"
									/>
								</view>
							</view>

							<!-- 术前诊断 -->
							<view v-if="item.preopDiagnosis" class="remark">
								<up-text text="术前诊断" size="small" color="info" />
								<up-text :text="item.preopDiagnosis" size="small" block />
							</view>

							<!-- 术中处理 -->
							<view v-if="item.intraopManagement" class="remark">
								<up-text text="术中处理" size="small" color="info" />
								<up-text :text="item.intraopManagement" size="small" block />
							</view>
						</template>
					</up-card>
				</view>
			</view>
		</view>

		<!-- 空状态 -->
		<view v-else-if="!loading" class="empty-state">
			<up-text text="暂无治疗记录" color="info" />
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { logger } from "@/utils/logger";

interface TreatmentItem {
	id: number;
	swlNo: string;
	serialNumber: string;
	sequenceNo: number;
	episode: number;
	treatmentTime: string;
	machine1?: string;
	machine2?: string;
	bodyPosition?: string;
	targetingMethod?: string;
	voltage?: string;
	shockwaveCount?: string;
	pulseRate?: string;
	stoneCount?: number;
	preopDiagnosis?: string;
	intraopManagement?: string;
	doctor?: string;
	painScore?: string;
	noAdverseReaction?: number;
	hasSkinBleeding?: number;
	hasNausea?: number;
	hasRadiationPain?: number;
	otherAdverseReaction?: number;
	[key: string]: any;
}

const query = ref<Record<string, string>>({});
const list = ref<TreatmentItem[]>([]);
const loading = ref(false);

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

/**
 * 不良反应标签
 */
function getAdverseTags(item: TreatmentItem) {
	return [
		{ key: "no", label: "无不良反应", has: item.noAdverseReaction === 1 },
		{ key: "skin", label: "皮肤渗血", has: item.hasSkinBleeding === 1 },
		{ key: "nausea", label: "恶心呕吐", has: item.hasNausea === 1 },
		{ key: "pain", label: "放射痛", has: item.hasRadiationPain === 1 },
		{ key: "other", label: "其他", has: item.otherAdverseReaction === 1 },
	];
}

async function loadList() {
	loading.value = true;
	try {
		// TODO: Step 4 后端就绪后替换为 service.swl.treatment.getBySwlNo
		// 当前使用 mock 数据演示 UI
		const { swlNo } = query.value;
		logger.log("loading treatment for swlNo:", swlNo);
		await new Promise((r) => setTimeout(r, 200));
		list.value = [
			{
				id: 2,
				swlNo: swlNo || "",
				serialNumber: "0002-789",
				sequenceNo: 2,
				episode: 1,
				treatmentTime: "2024-06-15 14:00",
				machine1: "HK.ESWL-V",
				machine2: "-",
				bodyPosition: "仰卧位",
				targetingMethod: "超声定位",
				voltage: "2.5",
				shockwaveCount: "2400",
				pulseRate: "80",
				stoneCount: 1,
				preopDiagnosis: "左肾盂结石（10mm）",
				intraopManagement: "术中生命体征平稳",
				doctor: "李医生",
				painScore: "3",
				noAdverseReaction: 0,
				hasSkinBleeding: 1,
				hasNausea: 0,
				hasRadiationPain: 0,
				otherAdverseReaction: 0,
			},
			{
				id: 1,
				swlNo: swlNo || "",
				serialNumber: "0001-456",
				sequenceNo: 1,
				episode: 1,
				treatmentTime: "2024-06-01 10:30",
				machine1: "HK.ESWL-V",
				machine2: "-",
				bodyPosition: "仰卧位",
				targetingMethod: "X线定位",
				voltage: "3.0",
				shockwaveCount: "3000",
				pulseRate: "90",
				stoneCount: 2,
				preopDiagnosis: "左肾盂结石（12mm）+ 输尿管结石（6mm）",
				intraopManagement: "碎石满意，未见明显不良反应",
				doctor: "李医生",
				painScore: "4",
				noAdverseReaction: 1,
				hasSkinBleeding: 0,
				hasNausea: 0,
				hasRadiationPain: 0,
				otherAdverseReaction: 0,
			},
		];
	} catch (error: any) {
		logger.error("加载治疗记录失败:", error);
		list.value = [];
	} finally {
		loading.value = false;
	}
}

// 首次进入加载
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

.adverse {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;

	&__tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-top: 12rpx;
	}
}

.remark {
	margin-top: 20rpx;
	padding-top: 20rpx;
	border-top: 1rpx solid #f0f0f0;

	& + .remark {
		border-top: none;
		padding-top: 16rpx;
	}
}

.empty-state,
.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
