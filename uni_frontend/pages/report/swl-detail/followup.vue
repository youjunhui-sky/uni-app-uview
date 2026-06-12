<template>
	<page-wrapper>
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}  患者：${query.name || '-'}`" size="small" color="#666" />
		</view>

		<!-- 3 子 Tab：近期 / 远期 / 疗效 -->
		<view class="tabs">
			<view
				v-for="(t, idx) in tabList"
				:key="t.key"
				class="tabs__item"
				:class="{ 'tabs__item--active': activeTab === idx }"
				@tap="activeTab = idx"
			>
				<up-text :text="t.label" size="medium" :color="activeTab === idx ? '#ff9500' : '#666'" :bold="activeTab === idx" />
			</view>
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>

		<!-- ===== 近期随访 ===== -->
		<view v-else-if="activeTab === 0">
			<up-card v-for="item in nearList" :key="item.id" :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text :text="formatDate(item.followupDate) || '-'" bold size="medium" />
						<up-text :text="`第 ${item.followupCount} 次随访`" size="small" color="info" />
					</view>
				</template>
				<template #body>
					<up-text text="基本信息" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="术后天数" size="small" color="info" />
							<up-text :text="formatVal(item.postopDays, ' 天')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="末期肉眼血尿" size="small" color="info" />
							<up-text :text="item.grossHematuria || '-'" size="small" />
						</view>
					</view>
					<up-text text="症状与体征" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="发热" :type="item.fever === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="恶心" :type="item.nausea === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="呕吐" :type="item.vomiting === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="皮肤渗血" :type="item.skinEcchymosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾包膜下血肿" :type="item.subcapsularHematoma === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾出血" :type="item.renalHemorrhage === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="感染" :type="item.infection === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾绞痛" :type="item.renalColic === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾衰" :type="item.renalFailure === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
					<view class="info-grid" style="margin-top: 16rpx;">
						<view class="info-item">
							<up-text text="腰腹痛程度" size="small" color="info" />
							<up-text :text="item.flankPainLevel || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="石街类型" size="small" color="info" />
							<up-text :text="item.steinstrasseType || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="石街长度" size="small" color="info" />
							<up-text :text="formatVal(item.steinstrasseLength, ' cm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="排石时间" size="small" color="info" />
							<up-text :text="item.stonePassDays ? item.stonePassDays + ' 天' : '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="排石量" size="small" color="info" />
							<up-text :text="item.stoneOutputLevel || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="无石" size="small" color="info" />
							<up-text :text="item.stoneFree === 1 ? '是' : item.stoneFree === 0 ? '否' : '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="残余结石" size="small" color="info" />
							<up-text :text="item.residualStone === 1 ? '是' : item.residualStone === 0 ? '否' : '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="残余结石大小" size="small" color="info" />
							<up-text :text="item.stoneSize || '-'" size="small" />
						</view>
					</view>
					<view v-if="item.imagingFindings" class="remark">
						<up-text text="影像学发现" size="small" color="info" />
						<up-text :text="item.imagingFindings" size="small" block />
					</view>
					<up-text text="治疗辅助" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="内科辅助" size="small" color="info" />
							<up-text :text="item.medicalTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 前辅助" size="small" color="info" />
							<up-text :text="item.preSWLTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 后治疗辅助" size="small" color="info" />
							<up-text :text="item.postSWLTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 后补助辅助" size="small" color="info" />
							<up-text :text="item.postSWLSupport || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="抗生素使用" size="small" color="info" />
							<up-text :text="item.antibioticsUsed === 1 ? '是' : item.antibioticsUsed === 0 ? '否' : '-'" size="small" />
						</view>
						<view class="info-item" style="grid-column: span 2;">
							<up-text text="抗生素说明" size="small" color="info" />
							<up-text :text="item.antibioticsNote || '-'" size="small" />
						</view>
					</view>
					<up-text text="结石成分" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="成分一" size="small" color="info" />
							<up-text :text="formatPercent(item.component1, item.component1Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分二" size="small" color="info" />
							<up-text :text="formatPercent(item.component2, item.component2Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分三" size="small" color="info" />
							<up-text :text="formatPercent(item.component3, item.component3Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分四" size="small" color="info" />
							<up-text :text="formatPercent(item.component4, item.component4Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="分析方法" size="small" color="info" />
							<up-text :text="item.analysisMethod || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="疗效评定" size="small" color="info" />
							<up-text :text="item.effectiveness || '-'" size="small" />
						</view>
					</view>
					<up-text text="检查结果" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view v-if="item.usFinding" class="remark">
						<up-text text="B超" size="small" color="info" />
						<up-text :text="item.usFinding" size="small" block />
					</view>
					<view v-if="item.kubFinding" class="remark">
						<up-text text="KUB" size="small" color="info" />
						<up-text :text="item.kubFinding" size="small" block />
					</view>
					<view v-if="item.otherFinding" class="remark">
						<up-text text="其他" size="small" color="info" />
						<up-text :text="item.otherFinding" size="small" block />
					</view>
					<view class="info-grid" style="margin-top: 16rpx;">
						<view class="info-item">
							<up-text text="随访医生" size="small" color="info" />
							<up-text :text="item.physician || '-'" size="small" />
						</view>
					</view>
				</template>
			</up-card>
			<view v-if="nearList.length === 0" class="empty"><up-text text="暂无近期随访数据" color="info" /></view>
		</view>

		<!-- ===== 远期随访 ===== -->
		<view v-else-if="activeTab === 1">
			<up-card v-for="item in futureList" :key="item.id" :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text :text="formatDate(item.followupDate) || '-'" bold size="medium" />
						<up-text :text="`第 ${item.followupCount} 次随访`" size="small" color="info" />
					</view>
				</template>
				<template #body>
					<up-text text="基本信息" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="末次 SWL 术后月数" size="small" color="info" />
							<up-text :text="formatVal(item.lastSWLMonths, ' 月')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="总 SWL 次数" size="small" color="info" />
							<up-text :text="formatVal(item.totalSWLTimes)" size="small" />
						</view>
						<view class="info-item" style="grid-column: span 2;">
							<up-text text="已治疗结石" size="small" color="info" />
							<up-text :text="item.treatedStones || '-'" size="small" />
						</view>
						<view class="info-item" style="grid-column: span 2;">
							<up-text text="未治疗结石" size="small" color="info" />
							<up-text :text="item.untreatedStones || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="轻度肾萎缩" :type="item.mildAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="中度肾萎缩" :type="item.moderateAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="重度肾萎缩" :type="item.severeAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾周积液" :type="item.perirenalFluid === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="肾功能丧失" :type="item.renalFunctionLoss === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="集合系统狭窄" :type="item.collectingSystemStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="输尿管狭窄" :type="item.ureteralStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾功能损害" :type="item.renalImpairment === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="复发性尿路感染" :type="item.recurrentUTI === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="儿童生长发育障碍" :type="item.growthDisorder === 1 ? 'warning' : 'info'" plain size="mini" />
					</view>
					<up-text text="血压与生活习惯" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="基础血压" size="small" color="info" />
							<up-text :text="item.baselineBP || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="血压变化" size="small" color="info" />
							<up-text :text="item.bpChange || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="生活习惯" size="small" color="info" />
							<up-text :text="item.liveHabitChange || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="饮水量变化" size="small" color="info" />
							<up-text :text="item.waterHabitChange || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="每日饮水量" size="small" color="info" />
							<up-text :text="item.dailyWaterIntake ? item.dailyWaterIntake + ' ml/d' : '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="职业是否改变" size="small" color="info" />
							<up-text :text="item.occupationalChange === 1 ? '是' : item.occupationalChange === 0 ? '否' : '-'" size="small" />
						</view>
						<view class="info-item" style="grid-column: span 2;">
							<up-text text="职业风险暴露" size="small" color="info" />
							<up-text :text="item.occupationalRisk || '-'" size="small" />
						</view>
					</view>
					<up-text text="检查结果" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view v-if="item.bloodAbnormalities" class="remark">
						<up-text text="血液异常指标" size="small" color="info" />
						<up-text :text="item.bloodAbnormalities" size="small" block />
					</view>
					<view v-if="item.urineAbnormalities" class="remark">
						<up-text text="尿液异常指标" size="small" color="info" />
						<up-text :text="item.urineAbnormalities" size="small" block />
					</view>
					<view v-if="item.usFinding" class="remark">
						<up-text text="B超" size="small" color="info" />
						<up-text :text="item.usFinding" size="small" block />
					</view>
					<view v-if="item.kubFinding" class="remark">
						<up-text text="KUB" size="small" color="info" />
						<up-text :text="item.kubFinding" size="small" block />
					</view>
					<view v-if="item.ivuFinding" class="remark">
						<up-text text="IVU" size="small" color="info" />
						<up-text :text="item.ivuFinding" size="small" block />
					</view>
					<view v-if="item.ectFinding" class="remark">
						<up-text text="ECT" size="small" color="info" />
						<up-text :text="item.ectFinding" size="small" block />
					</view>
					<view v-if="item.otherFinding" class="remark">
						<up-text text="其他" size="small" color="info" />
						<up-text :text="item.otherFinding" size="small" block />
					</view>
					<view class="info-grid" style="margin-top: 16rpx;">
						<view class="info-item">
							<up-text text="随访医生" size="small" color="info" />
							<up-text :text="item.physician || '-'" size="small" />
						</view>
					</view>
				</template>
			</up-card>
			<view v-if="futureList.length === 0" class="empty"><up-text text="暂无远期随访数据" color="info" /></view>
		</view>

		<!-- ===== 疗效评定 ===== -->
		<view v-else-if="activeTab === 2">
			<up-card v-for="item in curativeList" :key="item.id" :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text :text="formatDate(item.followupDate) || '-'" bold size="medium" />
						<up-text :text="`术后 ${item.postopDays || 0} 天`" size="small" color="info" />
					</view>
				</template>
				<template #body>
					<up-text text="基本信息" size="small" bold block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="末期肉眼血尿" size="small" color="info" />
							<up-text :text="item.grossHematuria || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="腰腹痛程度" size="small" color="info" />
							<up-text :text="item.flankPainLevel || '-'" size="small" />
						</view>
					</view>
					<up-text text="症状" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="发热" :type="item.fever === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="恶心" :type="item.nausea === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="呕吐" :type="item.vomiting === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="皮肤渗血" :type="item.skinEcchymosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾包膜下血肿" :type="item.subcapsularHematoma === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾出血" :type="item.renalHemorrhage === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="感染" :type="item.infection === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾绞痛" :type="item.renalColic === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾衰" :type="item.renalFailure === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
					<up-text text="石街" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="石街类型" size="small" color="info" />
							<up-text :text="item.steinstrasseType || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="石街长度" size="small" color="info" />
							<up-text :text="formatVal(item.steinstrasseLength, ' cm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="排石时间" size="small" color="info" />
							<up-text :text="item.stonePassDays ? item.stonePassDays + ' 天' : '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="排石量" size="small" color="info" />
							<up-text :text="item.stoneOutputLevel || '-'" size="small" />
						</view>
					</view>
					<up-text text="治疗辅助" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="内科辅助" size="small" color="info" />
							<up-text :text="item.medicalTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 前辅助" size="small" color="info" />
							<up-text :text="item.preSWLTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 后治疗辅助" size="small" color="info" />
							<up-text :text="item.postSWLTherapy || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="SWL 后补助辅助" size="small" color="info" />
							<up-text :text="item.postSWLSupport || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="抗生素使用" size="small" color="info" />
							<up-text :text="item.antibioticsUsed === 1 ? '是' : item.antibioticsUsed === 0 ? '否' : '-'" size="small" />
						</view>
						<view class="info-item" style="grid-column: span 2;">
							<up-text text="抗生素说明" size="small" color="info" />
							<up-text :text="item.antibioticsNote || '-'" size="small" />
						</view>
					</view>
					<up-text text="结石成分" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="成分一" size="small" color="info" />
							<up-text :text="formatPercent(item.component1, item.component1Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分二" size="small" color="info" />
							<up-text :text="formatPercent(item.component2, item.component2Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分三" size="small" color="info" />
							<up-text :text="formatPercent(item.component3, item.component3Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="成分四" size="small" color="info" />
							<up-text :text="formatPercent(item.component4, item.component4Percent)" size="small" />
						</view>
						<view class="info-item">
							<up-text text="分析方法" size="small" color="info" />
							<up-text :text="item.analysisMethod || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="疗效评定" size="small" color="info" />
							<up-text :text="item.effectiveness || '-'" size="small" />
						</view>
					</view>
					<up-text text="疗效参数" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="无石" :type="item.curativeParamStoneFree === 1 ? 'success' : 'info'" plain size="mini" />
						<up-tag text="初震参数" :type="item.curativeParamInitialShock === 1 ? 'success' : 'info'" plain size="mini" />
						<up-tag text="复震参数" :type="item.curativeParamRepeatShock === 1 ? 'success' : 'info'" plain size="mini" />
						<up-tag text="SWL 前辅助" :type="item.curativeParamPreSWL === 1 ? 'success' : 'info'" plain size="mini" />
						<up-tag text="SWL 后治疗辅助" :type="item.curativeParamPostSWLTherapy === 1 ? 'success' : 'info'" plain size="mini" />
						<up-tag text="SWL 后补助辅助" :type="item.curativeParamPostSWLSupport === 1 ? 'success' : 'info'" plain size="mini" />
					</view>
					<up-text text="代谢异常" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="痛风" :type="item.metabolicGout === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾小管酸中毒" :type="item.metabolicRTA === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="低磷血症" :type="item.metabolicHypophosphatemia === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="高草酸尿" :type="item.metabolicHyperoxaluria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="甲旁亢" :type="item.metabolicHyperparathyroidism === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="高钠尿" :type="item.metabolicHypernatriuria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="碱性尿" :type="item.metabolicAlkalineUrine === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="高钙尿" :type="item.metabolicHypercalciuria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="低镁尿" :type="item.metabolicHypomagnesuria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="高尿酸尿" :type="item.metabolicHyperuricosuria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="低枸橼酸尿" :type="item.metabolicHypocitraturia === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="胱氨酸尿" :type="item.metabolicCystinuria === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="不明确" :type="item.metabolicUnknown === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
					<up-text text="局部解剖异常" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="海绵肾" :type="item.localSpongeKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="马蹄肾" :type="item.localHorseshoeKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾囊肿" :type="item.localRenalCyst === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="重复肾" :type="item.localDuplexKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="BPH" :type="item.localBPH === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="UPJ 狭窄" :type="item.localUPJStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="多囊肾" :type="item.localPolycysticKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿道狭窄" :type="item.localUrethralStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿道异物" :type="item.localUrethralForeignBody === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="输尿管狭窄" :type="item.localUreteralStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="异位肾" :type="item.localEctopicKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="膀胱憩室" :type="item.localBladderDiverticulum === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="神经源性膀胱" :type="item.localNeurogenicBladder === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾盏憩室" :type="item.localCalycealDiverticulum === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="输尿管囊肿" :type="item.localUreterocele === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="其他" :type="item.localOther === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
					<up-text text="检查结果" size="small" bold block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view v-if="item.usFinding" class="remark">
						<up-text text="B超" size="small" color="info" />
						<up-text :text="item.usFinding" size="small" block />
					</view>
					<view v-if="item.kubFinding" class="remark">
						<up-text text="KUB" size="small" color="info" />
						<up-text :text="item.kubFinding" size="small" block />
					</view>
					<view v-if="item.otherFinding" class="remark">
						<up-text text="其他" size="small" color="info" />
						<up-text :text="item.otherFinding" size="small" block />
					</view>
					<view class="info-grid" style="margin-top: 16rpx;">
						<view class="info-item">
							<up-text text="随访医生" size="small" color="info" />
							<up-text :text="item.physician || '-'" size="small" />
						</view>
					</view>
				</template>
			</up-card>
			<view v-if="curativeList.length === 0" class="empty"><up-text text="暂无疗效评定数据" color="info" /></view>
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { service } from "@/composables/useService";
import { logger } from "@/utils/logger";

const query = ref<Record<string, string>>({});
const loading = ref(false);

const tabList = [
	{ key: "near", label: "近期随访" },
	{ key: "future", label: "远期随访" },
	{ key: "curative", label: "疗效评定" },
];
const activeTab = ref(0);

const nearList = ref<any[]>([]);
const futureList = ref<any[]>([]);
const curativeList = ref<any[]>([]);

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

function formatPercent(name?: string, percent?: string | number) {
	if (!name) return "-";
	if (percent === null || percent === undefined || percent === "") return name;
	return `${name} (${percent}%)`;
}

async function loadAll() {
	const { swlNo, serialNumber } = query.value;
	if (!swlNo) {
		uni.showToast({ title: "缺少碎石号", icon: "none" });
		return;
	}
	loading.value = true;
	const baseQuery = { swlNo, serialNumber };
	try {
		const [near, future, curative] = await Promise.all([
			service.swl.followup.near.findBySwlNo(baseQuery).catch(() => []),
			service.swl.followup.future.findBySwlNo(baseQuery).catch(() => []),
			service.swl.followup.curative.findBySwlNo(baseQuery).catch(() => []),
		]);
		nearList.value = near;
		futureList.value = future;
		curativeList.value = curative;
		logger.log("followup all loaded");
	} catch (error: any) {
		logger.error("加载随访数据失败:", error);
		uni.showToast({ title: error.message || "加载失败", icon: "none" });
	} finally {
		loading.value = false;
	}
}

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
	loadAll();
});
</script>

<style lang="scss" scoped>
.info-bar {
	padding: 16rpx 24rpx;
	background: #fff;
}

.tabs {
	display: flex;
	background: #fff;
	border-bottom: 1rpx solid #f0f0f0;
	position: sticky;
	top: 0;
	z-index: 10;

	&__item {
		flex: 1;
		padding: 24rpx 0;
		text-align: center;
		position: relative;
	}

	&__item--active::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 60rpx;
		height: 4rpx;
		background: #ff9500;
		border-radius: 2rpx;
	}
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

.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.remark {
	margin-top: 16rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid #f0f0f0;
}

.empty,
.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
