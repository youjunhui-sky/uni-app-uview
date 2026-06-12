<template>
	<page-wrapper>
		<view class="info-bar">
			<up-text :text="`碎石号：${query.swlNo || '-'}`" size="small" color="#666" />
		</view>

		<view v-if="loading" class="loading-state">
			<up-text text="加载中..." color="info" />
		</view>

		<view v-else-if="detail" class="report-content">
			<!-- 1. 检查类型 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<view class="card-head">
						<up-text text="检查类型" bold size="medium" />
					</view>
				</template>
				<template #body>
					<view class="check-types">
						<up-tag v-for="t in checkTypeTags" :key="t.key" :text="t.label" :type="t.has ? 'success' : 'info'" plain size="mini" />
					</view>
					<view class="info-grid" style="margin-top: 20rpx;">
						<view class="info-item">
							<up-text text="CT 值" size="small" color="info" />
							<up-text :text="formatVal(detail.ctValue, ' HU')" size="small" />
						</view>
					</view>
				</template>
			</up-card>

			<!-- 2. 左肾 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="左肾" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="结石数量" size="small" color="info" />
							<up-text :text="detail.leftKidneyStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="结石形状" size="small" color="info" />
							<up-text :text="detail.leftKidneyStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="结石性质" size="small" color="info" />
							<up-text :text="detail.leftKidneyStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.leftKidneyStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.leftKidneyStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.leftKidneyStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="轻度积水" :type="detail.leftKidneyMildHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="中度积水" :type="detail.leftKidneyModerateHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="重度积水" :type="detail.leftKidneySevereHydronephrosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾功能损害" :type="detail.leftKidneyDysfunction === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾小盏扩张" :type="detail.leftKidneyCalycealDilation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="肾大盏扩张" :type="detail.leftKidneyMajorCalyxDilation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="肾萎缩" :type="detail.leftKidneyAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 3. 右肾 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="右肾" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="结石数量" size="small" color="info" />
							<up-text :text="detail.rightKidneyStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="结石形状" size="small" color="info" />
							<up-text :text="detail.rightKidneyStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="结石性质" size="small" color="info" />
							<up-text :text="detail.rightKidneyStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.rightKidneyStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.rightKidneyStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.rightKidneyStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="轻度积水" :type="detail.rightKidneyMildHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="中度积水" :type="detail.rightKidneyModerateHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="重度积水" :type="detail.rightKidneySevereHydronephrosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾功能损害" :type="detail.rightKidneyDysfunction === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾小盏扩张" :type="detail.rightKidneyCalycealDilation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="肾大盏扩张" :type="detail.rightKidneyMajorCalyxDilation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="肾萎缩" :type="detail.rightKidneyAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 4. 左输尿管 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="左输尿管" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="数量" size="small" color="info" />
							<up-text :text="detail.leftUreterStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="形状" size="small" color="info" />
							<up-text :text="detail.leftUreterStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="性质" size="small" color="info" />
							<up-text :text="detail.leftUreterStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.leftUreterStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.leftUreterStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.leftUreterStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="轻度积水" :type="detail.leftUreterMildHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="中度积水" :type="detail.leftUreterModerateHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="重度积水" :type="detail.leftUreterSevereHydronephrosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾功能损害" :type="detail.leftUreterDysfunction === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾萎缩" :type="detail.leftUreterAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 5. 右输尿管 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="右输尿管" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="数量" size="small" color="info" />
							<up-text :text="detail.rightUreterStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="形状" size="small" color="info" />
							<up-text :text="detail.rightUreterStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="性质" size="small" color="info" />
							<up-text :text="detail.rightUreterStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.rightUreterStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.rightUreterStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.rightUreterStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="轻度积水" :type="detail.rightUreterMildHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="中度积水" :type="detail.rightUreterModerateHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="重度积水" :type="detail.rightUreterSevereHydronephrosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾功能损害" :type="detail.rightUreterDysfunction === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾萎缩" :type="detail.rightUreterAtrophy === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 6. 膀胱 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="膀胱" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="数量" size="small" color="info" />
							<up-text :text="detail.bladderStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="形状" size="small" color="info" />
							<up-text :text="detail.bladderStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="性质" size="small" color="info" />
							<up-text :text="detail.bladderStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.bladderStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.bladderStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.bladderStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="尿潴留" :type="detail.bladderUrinaryRetention === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="膀胱炎症" :type="detail.bladderInflammation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="刺激症状" :type="detail.bladderIrritation === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="膀胱梗阻" :type="detail.bladderObstruction === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿急尿痛" :type="detail.bladderPainful === 1 ? 'warning' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 7. 尿道 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="尿道" bold size="medium" />
				</template>
				<template #body>
					<up-text text="结石信息" size="small" bold color="#303133" block :customStyle="{ marginBottom: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="数量" size="small" color="info" />
							<up-text :text="detail.urethraStoneCount || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="形状" size="small" color="info" />
							<up-text :text="detail.urethraStoneShape || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="性质" size="small" color="info" />
							<up-text :text="detail.urethraStoneNature || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 1 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone1Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone1Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone1Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.urethraStone1Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="第 2 颗" size="mini" color="info" block :customStyle="{ marginTop: '12rpx' }" />
					<view class="info-grid">
						<view class="info-item">
							<up-text text="长径" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone2Front, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="宽径" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone2Back, ' mm')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="表面积" size="small" color="info" />
							<up-text :text="formatVal(detail.urethraStone2Area, ' mm²')" size="small" />
						</view>
						<view class="info-item">
							<up-text text="位置" size="small" color="info" />
							<up-text :text="detail.urethraStone2Location || '-'" size="small" />
						</view>
					</view>
					<up-text text="并发症" size="small" bold color="#303133" block :customStyle="{ marginTop: '20rpx', marginBottom: '12rpx' }" />
					<view class="tag-row">
						<up-tag text="尿潴留" :type="detail.urethraUrinaryRetention === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="轻度肾积水" :type="detail.urethraMildHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="中度肾积水" :type="detail.urethraModerateHydronephrosis === 1 ? 'warning' : 'info'" plain size="mini" />
						<up-tag text="重度肾积水" :type="detail.urethraSevereHydronephrosis === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿急尿痛" :type="detail.urethraPainful === 1 ? 'warning' : 'info'" plain size="mini" />
					</view>
				</template>
			</up-card>

			<!-- 8. 并发症汇总 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="其他并发症" bold size="medium" />
				</template>
				<template #body>
					<view class="tag-row">
						<up-tag text="多囊肾" :type="detail.complicationPolycysticKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="重复肾" :type="detail.complicationDuplexKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="马蹄肾" :type="detail.complicationHorseshoeKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="输尿管狭窄" :type="detail.complicationUreteralStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿道狭窄" :type="detail.complicationUrethralStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="膀胱憩室" :type="detail.complicationBladderDiverticulum === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="海绵肾" :type="detail.complicationMedullarySpongeKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾囊肿" :type="detail.complicationRenalCyst === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="异位肾" :type="detail.complicationEctopicKidney === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="神经源性膀胱" :type="detail.complicationNeurogenicBladder === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="输尿管囊肿" :type="detail.complicationUreterocele === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿道异物" :type="detail.complicationUrethralForeignBody === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="肾脏憩室" :type="detail.complicationRenalDiverticulum === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="UPJ 狭窄" :type="detail.complicationUPJStricture === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="BPH" :type="detail.complicationBPH === 1 ? 'error' : 'info'" plain size="mini" />
						<up-tag text="尿道憩室" :type="detail.complicationUrethralDiverticulum === 1 ? 'error' : 'info'" plain size="mini" />
					</view>
					<view v-if="detail.hasOtherComplications === 1 && detail.otherComplicationsDesc" style="margin-top: 16rpx;">
						<up-text text="其他并发症描述" size="small" color="info" />
						<up-text :text="detail.otherComplicationsDesc" size="small" block />
					</view>
				</template>
			</up-card>

			<!-- 9. 登记信息 -->
			<up-card :border="false" :customStyle="{ marginBottom: '20rpx' }">
				<template #head>
					<up-text text="登记信息" bold size="medium" />
				</template>
				<template #body>
					<view class="info-grid">
						<view class="info-item">
							<up-text text="登记人" size="small" color="info" />
							<up-text :text="detail.registrar || '-'" size="small" />
						</view>
						<view class="info-item">
							<up-text text="登记时间" size="small" color="info" />
							<up-text :text="formatDate(detail.registerTime) || '-'" size="small" />
						</view>
					</view>
				</template>
			</up-card>

			<!-- 10. 影像图片 -->
			<up-card :border="false">
				<template #head>
					<up-text text="影像图片" bold size="medium" />
				</template>
				<template #body>
					<scroll-view v-if="imageList.length > 0" scroll-x class="image-scroll">
						<view v-for="(img, idx) in imageList" :key="idx" class="image-item" @tap="previewImage(idx)">
							<image :src="img" mode="aspectFill" class="image-thumb"></image>
						</view>
					</scroll-view>
					<view v-else class="empty-inline">
						<up-text text="暂无影像图片" color="info" />
					</view>
				</template>
			</up-card>
		</view>

		<view v-else class="empty-state">
			<up-text text="暂无超声报告" color="info" />
		</view>
	</page-wrapper>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import pageWrapper from "@/components/page-wrapper.vue";
import { service } from "@/composables/useService";
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
	leftKidneyStoneCount?: string;
	leftKidneyStone1Front?: number;
	leftKidneyStone1Back?: number;
	leftKidneyStone1Area?: number;
	leftKidneyStone1Location?: string;
	leftKidneyStone2Front?: number;
	leftKidneyStone2Back?: number;
	leftKidneyStone2Area?: number;
	leftKidneyStone2Location?: string;
	leftKidneyStoneShape?: string;
	leftKidneyStoneNature?: string;
	leftKidneyMildHydronephrosis?: number;
	leftKidneyModerateHydronephrosis?: number;
	leftKidneyDysfunction?: number;
	leftKidneyCalycealDilation?: number;
	leftKidneySevereHydronephrosis?: number;
	leftKidneyMajorCalyxDilation?: number;
	leftKidneyAtrophy?: number;
	rightKidneyStoneCount?: string;
	rightKidneyStone1Front?: number;
	rightKidneyStone1Back?: number;
	rightKidneyStone1Area?: number;
	rightKidneyStone1Location?: string;
	rightKidneyStone2Front?: number;
	rightKidneyStone2Back?: number;
	rightKidneyStone2Area?: number;
	rightKidneyStone2Location?: string;
	rightKidneyStoneShape?: string;
	rightKidneyStoneNature?: string;
	rightKidneyMildHydronephrosis?: number;
	rightKidneyModerateHydronephrosis?: number;
	rightKidneyDysfunction?: number;
	rightKidneyCalycealDilation?: number;
	rightKidneySevereHydronephrosis?: number;
	rightKidneyMajorCalyxDilation?: number;
	rightKidneyAtrophy?: number;
	leftUreterStoneCount?: string;
	leftUreterStone1Front?: number;
	leftUreterStone1Back?: number;
	leftUreterStone1Area?: number;
	leftUreterStone1Location?: string;
	leftUreterStone2Front?: number;
	leftUreterStone2Back?: number;
	leftUreterStone2Area?: number;
	leftUreterStone2Location?: string;
	leftUreterStoneShape?: string;
	leftUreterStoneNature?: string;
	leftUreterMildHydronephrosis?: number;
	leftUreterModerateHydronephrosis?: number;
	leftUreterDysfunction?: number;
	leftUreterSevereHydronephrosis?: number;
	leftUreterAtrophy?: number;
	rightUreterStoneCount?: string;
	rightUreterStone1Front?: number;
	rightUreterStone1Back?: number;
	rightUreterStone1Area?: number;
	rightUreterStone1Location?: string;
	rightUreterStone2Front?: number;
	rightUreterStone2Back?: number;
	rightUreterStone2Area?: number;
	rightUreterStone2Location?: string;
	rightUreterStoneShape?: string;
	rightUreterStoneNature?: string;
	rightUreterMildHydronephrosis?: number;
	rightUreterModerateHydronephrosis?: number;
	rightUreterDysfunction?: number;
	rightUreterSevereHydronephrosis?: number;
	rightUreterAtrophy?: number;
	bladderStoneCount?: string;
	bladderStone1Front?: number;
	bladderStone1Back?: number;
	bladderStone1Area?: number;
	bladderStone1Location?: string;
	bladderStone2Front?: number;
	bladderStone2Back?: number;
	bladderStone2Area?: number;
	bladderStone2Location?: string;
	bladderStoneShape?: string;
	bladderStoneNature?: string;
	bladderUrinaryRetention?: number;
	bladderInflammation?: number;
	bladderIrritation?: number;
	bladderObstruction?: number;
	bladderPainful?: number;
	urethraStoneCount?: string;
	urethraStone1Front?: number;
	urethraStone1Back?: number;
	urethraStone1Area?: number;
	urethraStone1Location?: string;
	urethraStone2Front?: number;
	urethraStone2Back?: number;
	urethraStone2Area?: number;
	urethraStone2Location?: string;
	urethraStoneShape?: string;
	urethraStoneNature?: string;
	urethraUrinaryRetention?: number;
	urethraMildHydronephrosis?: number;
	urethraModerateHydronephrosis?: number;
	urethraSevereHydronephrosis?: number;
	urethraPainful?: number;
	complicationPolycysticKidney?: number;
	complicationDuplexKidney?: number;
	complicationHorseshoeKidney?: number;
	complicationUreteralStricture?: number;
	complicationUrethralStricture?: number;
	complicationBladderDiverticulum?: number;
	complicationMedullarySpongeKidney?: number;
	complicationRenalCyst?: number;
	complicationEctopicKidney?: number;
	complicationNeurogenicBladder?: number;
	complicationUreterocele?: number;
	complicationUrethralForeignBody?: number;
	complicationRenalDiverticulum?: number;
	complicationUPJStricture?: number;
	complicationBPH?: number;
	complicationUrethralDiverticulum?: number;
	hasOtherComplications?: number;
	otherComplicationsDesc?: string;
	registrar?: string;
	registerTime?: string;
	imageUrls?: string;
	[key: string]: any;
}

const query = ref<Record<string, string>>({});
const detail = ref<ImagingExamItem | null>(null);
const loading = ref(false);

onLoad((q) => {
	query.value = (q as Record<string, string>) || {};
});

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

const imageList = computed(() => {
	const d = detail.value;
	if (!d || !d.imageUrls) return [];
	return d.imageUrls.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
});

function formatVal(v?: number | null, unit = "") {
	if (v === null || v === undefined || v === "") return "-";
	return `${v}${unit}`;
}

function formatDate(v?: string) {
	if (!v) return "";
	try {
		const d = new Date(v);
		if (isNaN(d.getTime())) return v;
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {
		return v;
	}
}

function previewImage(index: number) {
	if (imageList.value.length === 0) return;
	uni.previewImage({
		urls: imageList.value,
		current: imageList.value[index],
	});
}

async function loadDetail() {
	const { swlNo, serialNumber } = query.value;
	if (!swlNo) {
		uni.showToast({ title: "缺少碎石号", icon: "none" });
		return;
	}
	loading.value = true;
	try {
		const res = await service.swl.imaging.findBySwlNo({
			swlNo,
			serialNumber,
		});
		logger.log("imaging res", res);
		detail.value = Array.isArray(res) && res.length > 0 ? res[0] : null;
	} catch (error: any) {
		logger.error("加载超声报告失败:", error);
		uni.showToast({ title: error.message || "加载失败", icon: "none" });
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

.check-types,
.tag-row {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
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

.empty-state,
.loading-state {
	padding: 80rpx 24rpx;
	text-align: center;
}
</style>
