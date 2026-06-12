<template>
	<view class="q-wrap">
		<view class="q-header" v-if="questionnaire">
			<text class="q-title">{{ questionnaire.title }}</text>
			<text class="q-desc" v-if="questionnaire.description">{{ questionnaire.description }}</text>
		</view>

		<view v-if="loading" class="q-status">加载中</view>
		<view v-else-if="error" class="q-status">{{ error }}</view>

		<!-- 填写模式 -->
		<view v-else-if="!finished && current && !lockedByDialog" class="q-body">
			<view class="q-question-header">
				<text class="q-type-tag">{{ current.type === 'single' ? '单选题' : current.type === 'multiple' ? '多选题' : '填写题' }}</text>
			</view>
			<view class="q-question">
				<text v-if="current.required" class="q-required">*</text>
				<text class="q-question-text">{{ current.title }}</text>
			</view>

			<view class="q-field">
				<radio-group v-if="current.type === 'single'" @change="onSingleChange(current.bh, $event)">
					<view v-for="opt in current.optionsSorted" :key="opt.option" class="q-option-wrapper">
						<label class="q-option">
							<radio :value="opt.option" :checked="answers[current.bh] === opt.option" />
							<text>{{ opt.content }}</text>
						</label>
						<input
							v-if="opt.other"
							type="text"
							class="q-input q-input-other"
							v-model="answersOther[current.bh][opt.option]"
							@input="onOtherSingleInput(current.bh, opt.option, $event)"
							placeholder="请输入"
						/>
					</view>
				</radio-group>

				<checkbox-group v-else-if="current.type === 'multiple'" @change="onMultipleChange(current.bh, $event)">
					<view v-for="opt in current.optionsSorted" :key="opt.option" class="q-option-wrapper">
						<label class="q-option">
							<checkbox :value="opt.option" :checked="Array.isArray(answers[current.bh]) && answers[current.bh].includes(opt.option)" />
							<text>{{ opt.content }}</text>
						</label>
						<input
							v-if="opt.other"
							type="text"
							class="q-input q-input-other"
							v-model="answersOther[current.bh][opt.option]"
							@input="onOtherMultipleInput(current.bh, opt.option, $event)"
							placeholder="请输入"
						/>
					</view>
				</checkbox-group>

				<input
					v-else-if="current.type === 'number'"
					type="number"
					class="q-input"
					v-model="answers[current.bh]"
					placeholder="请输入数字"
				/>
				<input
					v-else-if="current.type === 'text'"
					type="text"
					class="q-input"
					v-model="answers[current.bh]"
					placeholder="请输入"
				/>
				<date-picker
					v-else-if="current.type === 'year-month' || current.type === 'date' || current.type === 'datetime'"
					v-model="answers[current.bh]"
					:mode="getDatePickerMode(current.type)"
					:format="getDateFormat(current.type)"
					placeholder="请选择"
				/>
				<textarea v-else class="q-textarea" v-model="answers[current.bh]" placeholder="请输入"></textarea>
				<text v-if="currentError" class="q-error">{{ currentError }}</text>
			</view>

			<view class="q-actions">
				<up-button
					v-if="currentIndex > 0 || reachedEnd"
					class="q-btn"
					type="default"
					fill
					:border="false"
					:customStyle="{ height: '90rpx', fontSize: '30rpx' }"
					@click="prev"
				>
					上一题
				</up-button>
				<up-button
					v-if="reachedEnd"
					class="q-btn"
					type="primary"
					fill
					:border="false"
					:customStyle="{ height: '90rpx', fontSize: '32rpx', background: '#2563eb' }"
					@click="submit"
				>
					提交
				</up-button>
				<up-button
					v-else-if="currentIndex + 1 < total"
					class="q-btn"
					type="primary"
					fill
					:border="false"
					:customStyle="{ height: '90rpx', fontSize: '30rpx', background: '#2563eb' }"
					@click="next"
				>
					下一题
				</up-button>
				<up-button
					v-else
					class="q-btn"
					type="primary"
					fill
					:border="false"
					:customStyle="{ height: '90rpx', fontSize: '32rpx', background: '#2563eb' }"
					@click="submit"
				>
					提交
				</up-button>
			</view>

			<!-- 右侧浮动查看按钮 -->
			<view class="q-view-float" @tap="enterReview">
				<text class="q-view-float-text">查</text>
				<text>看</text>
			</view>
		</view>

		<!-- 查看模式 -->
		<view v-else-if="finished && !lockedByDialog" class="q-review">
			<scroll-view scroll-y class="q-review-list">
				<view v-for="(item, idx) in reviewList" :key="item.bh" class="q-review-item">
					<view
						class="q-review-no"
						:class="item.hasValue ? 'q-review-no--filled' : 'q-review-no--empty'"
					>
						{{ idx + 1 }}
					</view>
					<view class="q-review-main">
						<text class="q-review-question q-truncate" @tap="showQuestionDetail(item.title)">
							{{ item.displayTitle }}
						</text>
						<text class="q-review-answer q-truncate" @tap="showAnswerDetail(item.displayAnswer || '（未填写）')">
							{{ item.displayAnswerShort || '（未填写）' }}
						</text>
					</view>
				</view>
			</scroll-view>

			<view class="q-actions q-review-actions">
				<up-button
					class="q-btn"
					type="primary"
					fill
					:border="false"
					:customStyle="{ height: '90rpx', fontSize: '32rpx', background: '#2563eb' }"
					@click="reviewFromDialog ? backPage() : backToFill()"
				>
					{{ reviewFromDialog ? '返回' : '返回答题' }}
				</up-button>
			</view>
		</view>
	</view>
</template>

<script lang="ts" setup>
import { logger } from "@/utils/logger";
import { reactive, ref, computed, onMounted } from 'vue'
import { service } from "@/composables/useService";
import { useRouter } from "@/composables/useRouter";
import { storage } from "@/composables/useStorage";
import datePicker from "@/components/date-picker.vue";

type Option = { content: string; sort: number; option: string; other?: boolean }
type Question = {
	title: string;
	type: 'multiple' | 'single' | 'number' | 'text' | 'textarea' | 'year-month' | 'date' | 'datetime';
	sort: number;
	required: boolean;
	bh: string;
	jump?: Record<string, string>;
	options?: Option[];
}

const questionnaire = ref<{ id: number; title: string; description?: string; questions: Question[] } | null>(null)
const loading = ref(true)
const error = ref('')
const finished = ref(false)
const finalJson = ref<any>({})
const existingAnswerId = ref<number | null>(null)

const questions = ref<Question[]>([])
const currentIndex = ref(0)
const historyStack = ref<number[]>([])
const reachedEnd = ref(false)
const answers = reactive<Record<string, any>>({})
const answersOptions = reactive<Record<string, any>>({})
const answersOther = reactive<Record<string, Record<string, string>>>({})
const currentError = ref('')
const reviewList = ref<Array<{ bh: string; title: string; displayTitle: string; displayAnswer: string; displayAnswerShort: string; hasValue: boolean }>>([])
const reviewFromDialog = ref(false)
const lockedByDialog = ref(false)
const progressed = reactive<Record<string, boolean>>({})

const total = computed(() => questions.value.length)

const current = computed(() => {
	const q = questions.value[currentIndex.value]
	if (!q) return null as any
	const opts = (q.options || []).slice().sort((a,b)=>a.sort-b.sort)
	if (q.bh && !answersOther[q.bh]) {
		answersOther[q.bh] = {}
	}
	return { ...q, optionsSorted: opts } as any
})

function getDatePickerMode(type: string) {
	if (type === 'year-month') return ['year', 'month']
	if (type === 'datetime') return 'time'
	return ['year', 'month', 'date']
}

function getDateFormat(type: string) {
	if (type === 'year-month') return 'YYYY-MM'
	if (type === 'datetime') return 'YYYY-MM-DD HH:mm:ss'
	return 'YYYY-MM-DD'
}

function fetchQuestions() {
	loading.value = true
	error.value = ''
	service.questionnaire.questionnaire
		.questionsWithOptions()
		.then(async (res: any) => {
			questionnaire.value = { id: res.id, title: res.title, description: res.description, questions: res.questions || [] }
			questions.value = (res.questions || []).slice().sort((a: Question,b: Question)=>a.sort-b.sort)
			currentIndex.value = 0
			historyStack.value = []
			reachedEnd.value = false
			await checkExistingAnswer()
		})
		.catch(() => { error.value = '加载失败' })
		.finally(() => { loading.value = false })
}

async function checkExistingAnswer(): Promise<void> {
	const patientNo = storage.get("currentPatient")?.patientNo || ''
	const qid = questionnaire.value?.id
	if (!patientNo || !qid) return
	try {
		const res: any = await service.patient.questionnaire.getAnswer({
			patientNo,
			questionnaireId: qid,
		})
		const answeredQuestions: any[] = Array.isArray(res?.questions) ? res.questions : []
		if (res && answeredQuestions.length > 0) {
			existingAnswerId.value = res.id ?? null
			answersRefill()
			const answeredMap = new Map<string, any>()
			answeredQuestions.forEach((aq: any) => {
				const bh = String(aq.bh)
				answeredMap.set(bh, aq)
			})
			questions.value.forEach((q) => {
				const aq = answeredMap.get(String(q.bh))
				if (!aq) return
				const bh = String(q.bh)
				const value = aq.value
				if (value !== undefined) {
					answers[bh] = value
				}
				if (q.type === 'single') {
					const opts: Option[] = Array.isArray(aq.options) ? aq.options : []
					const vStr = value === undefined || value === null ? '' : String(value)
					if (vStr) {
						const opt = opts.find(o => String(o.option) === vStr)
						if (opt) {
							answersOptions[bh] = opt.content
						}
					}
					if (aq.other && typeof aq.other === 'object') {
						if (!answersOther[bh]) answersOther[bh] = {}
						Object.keys(aq.other).forEach(opt => {
							const otherValue = aq.other[opt]
							if (otherValue) {
								answersOther[bh][opt] = String(otherValue)
							}
						})
					}
				} else if (q.type === 'multiple') {
					const opts: Option[] = Array.isArray(aq.options) ? aq.options : []
					let codes: string[] = []
					if (Array.isArray(value)) {
						codes = value.map((v: any) => String(v))
					} else if (typeof value === 'string') {
						codes = value.split(',').map(s => s.trim()).filter(Boolean)
					}
					if (codes.length) {
						const contents = opts.filter(o => codes.includes(String(o.option))).map(o => o.content)
						if (contents.length) {
							answersOptions[bh] = contents
						}
					}
					if (aq.other && typeof aq.other === 'object') {
						if (!answersOther[bh]) answersOther[bh] = {}
						Object.keys(aq.other).forEach(opt => {
							const otherValue = aq.other[opt]
							if (otherValue) {
								answersOther[bh][opt] = String(otherValue)
							}
						})
					}
				}
			})
			lockedByDialog.value = true
			uni.showModal({
				title: '提示',
				content: '检测到您已填写过本问卷',
				cancelText: '重新填写',
				confirmText: '查看',
				success(result) {
					if (result.cancel) {
						lockedByDialog.value = false
						restart()
					} else if (result.confirm) {
						lockedByDialog.value = false
						reviewFromDialog.value = true
						buildResult()
						finished.value = true
					}
				}
			})
		} else {
			existingAnswerId.value = null
		}
	} catch (err) {
		logger.error("checkExistingAnswer error:", err)
		existingAnswerId.value = null
	}
}

function validate(q: Question): boolean {
	const v = answers[q.bh]
	if (q.required) {
		if (q.type === 'multiple') return Array.isArray(v) && v.length > 0
		return v !== undefined && v !== null && String(v).trim() !== ''
	}
	return true
}

function jumpNext(q: Question): 'end' | string | null {
	const map = q.jump || {}
	if (!map || Object.keys(map).length === 0) return null
	const normalize = (v: any) => String(v ?? '').trim().toUpperCase()
	const isEnd = (v: any) => normalize(v) === 'END'
	const getDefaultTarget = (): string | null => {
		const targets = Object.values(map).filter(v => {
			const s = String(v ?? '').trim()
			return s && normalize(v) !== 'END'
		})
		let maxIdx = -1
		let maxBh: string | null = null
		for (const t of targets) {
			const bh = String(t)
			const idx = indexByBh(bh)
			if (idx > maxIdx) {
				maxIdx = idx
				maxBh = bh
			}
		}
		return maxBh
	}
	if (q.type === 'single') {
		const key = answers[q.bh]
		if (key === undefined || key === null || String(key).trim() === '') {
			return getDefaultTarget() as any
		}
		const val = map[key] ?? map[normalize(key)]
		if (isEnd(val)) return 'end'
		if (val) return val as any
		return null
	}
	if (q.type === 'multiple') {
		return null
	}
	return null
}

function indexByBh(bh: string): number {
	return questions.value.findIndex(q => String(q.bh) === String(bh))
}

function computeVisitedBh(): Set<string> {
	const visited = new Set<string>()
	let idx = 0
	while (idx >= 0 && idx < questions.value.length) {
		const q = questions.value[idx]
		if (!q || visited.has(q.bh)) break
		visited.add(q.bh)
		const j = jumpNext(q)
		if (j === 'end') break
		if (typeof j === 'string' || typeof j === 'number') {
			const nextIdx = indexByBh(String(j))
			if (nextIdx < 0 || nextIdx === idx) break
			idx = nextIdx
		} else {
			idx += 1
		}
	}
	return visited
}

function truncateAnswerDisplay(text: string, maxCn = 5, maxEn = 7): string {
	if (!text) return ''
	const isCnChar = (ch: string) => /[一-龥　-〿＀-￯]/.test(ch)
	const chars = Array.from(text)
	const hasCn = chars.some(ch => isCnChar(ch))
	const hasEn = chars.some(ch => !isCnChar(ch))
	if (hasCn && hasEn) {
		let count = 0
		let result = ''
		for (const ch of chars) {
			if (count + 1 > maxCn) {
				result += '...'
				break
			}
			result += ch
			count += 1
		}
		return result
	}
	if (hasCn) {
		let count = 0
		let result = ''
		for (const ch of chars) {
			if (count + 1 > maxCn) {
				result += '...'
				break
			}
			result += ch
			count += 1
		}
		return result
	}
	let count = 0
	let result = ''
	for (const ch of chars) {
		if (count + 1 > maxEn) {
			result += '...'
			break
		}
		result += ch
		count += 1
	}
	return result
}

function buildResult() {
	const visited = computeVisitedBh()
	const list = questions.value
		.filter(q => visited.has(q.bh))
		.map(q => {
			const rawValue = answers[q.bh] === null ? '' : answers[q.bh] === undefined ? '' : answers[q.bh]
			const optionContent = q.type === 'single' || q.type === 'multiple' ? (answersOptions[q.bh] || (q.type === 'multiple' ? [] : '')) : ''
			const otherData: Record<string, string> = {}
			if ((q.type === 'single' || q.type === 'multiple') && answersOther[q.bh]) {
				Object.keys(answersOther[q.bh]).forEach(opt => {
					const otherValue = answersOther[q.bh][opt]
					if (otherValue && otherValue.trim()) {
						otherData[opt] = otherValue.trim()
					}
				})
			}
			return { bh: q.bh, value: rawValue, option: optionContent, other: Object.keys(otherData).length > 0 ? otherData : undefined }
		})
	finalJson.value = { answers: list }
	reviewList.value = questions.value
		.filter(q => visited.has(q.bh))
		.map(q => {
			const rawValue = answers[q.bh]
			const optionContent = answersOptions[q.bh]
			let displayAnswer = ''
			if (q.type === 'single' || q.type === 'multiple') {
				const displayParts: string[] = []
				if (q.type === 'single') {
					if (optionContent) {
						const selectedOpt = String(rawValue || '')
						const otherValue = answersOther[q.bh]?.[selectedOpt]?.trim()
						if (otherValue) {
							displayParts.push(`${optionContent}：${otherValue}`)
						} else {
							displayParts.push(optionContent)
						}
					}
				} else {
					if (Array.isArray(optionContent) && optionContent.length > 0) {
						const selectedOptions = Array.isArray(rawValue) ? rawValue.map(v => String(v)) : []
						selectedOptions.forEach(optValue => {
							const optObj = q.options?.find(o => String(o.option) === String(optValue))
							if (optObj) {
								const content = optObj.content
								const otherValue = answersOther[q.bh]?.[optValue]?.trim()
								if (otherValue) {
									displayParts.push(`${content}：${otherValue}`)
								} else {
									displayParts.push(content)
								}
							}
						})
					}
				}
				displayAnswer = displayParts.join('、')
			} else {
				displayAnswer = rawValue === null || rawValue === undefined ? '' : String(rawValue)
			}
			const fullTitle = q.title || ''
			const maxLen = 12
			const shortTitle = fullTitle.length > maxLen ? fullTitle.slice(0, maxLen) + '...' : fullTitle
			const fullAnswer = displayAnswer || ''
			const shortAnswer = truncateAnswerDisplay(fullAnswer, 5, 7)
			return { bh: q.bh, title: fullTitle, displayTitle: shortTitle, displayAnswer: fullAnswer, displayAnswerShort: shortAnswer, hasValue: displayAnswer !== '' }
		})
}

function submit() {
	buildResult()
	uni.showModal({
		title: '确认提交',
		content: '确定要提交问卷吗？',
		success: (res) => {
			if (res.confirm) {
				doSubmit()
			}
		}
	})
}

async function doSubmit() {
	const patientNo = storage.get("currentPatient")?.patientNo || ''
	if (!patientNo) {
		uni.showToast({ title: '请先选择就诊人', icon: 'none' })
		return
	}
	try {
		await service.patient.questionnaire.submitAnswer({
			patientNo,
			questionnaireId: questionnaire.value?.id,
			...finalJson.value
		})
		uni.showToast({ title: '提交成功', icon: 'success' })
		finished.value = true
	} catch (err: any) {
		uni.showToast({ title: err.message || '提交失败', icon: 'none' })
	}
}

function prev() {
	if (currentIndex.value > 0) {
		currentIndex.value--
	}
}

function next() {
	if (!current.value) return
	currentError.value = ''
	if (!validate(current.value)) {
		currentError.value = '请填写此题'
		return
	}
	progressed[current.value.bh] = true
	historyStack.value.push(currentIndex.value)
	const j = jumpNext(current.value)
	if (j === 'end') {
		reachedEnd.value = true
		currentIndex.value = questions.value.length - 1
	} else if (typeof j === 'string') {
		const idx = indexByBh(String(j))
		if (idx >= 0) {
			currentIndex.value = idx
		} else {
			currentIndex.value++
		}
	} else {
		currentIndex.value++
	}
}

function restart() {
	Object.keys(answers).forEach(k => delete answers[k])
	Object.keys(answersOptions).forEach(k => delete answersOptions[k])
	Object.keys(answersOther).forEach(k => delete answersOther[k])
	Object.keys(progressed).forEach(k => delete progressed[k])
	currentIndex.value = 0
	historyStack.value = []
	reachedEnd.value = false
}

function backPage() {
	uni.navigateBack()
}

function backToFill() {
	finished.value = false
	restart()
}

function enterReview() {
	buildResult()
	finished.value = true
}

function showQuestionDetail(title: string) {
	uni.showModal({ title: '题目', content: title, showCancel: false })
}

function showAnswerDetail(answer: string) {
	uni.showModal({ title: '答案', content: answer, showCancel: false })
}

function onSingleChange(bh: string, e: any) {
	answers[bh] = e.detail.value
}

function onMultipleChange(bh: string, e: any) {
	answers[bh] = e.detail.value
}

function onOtherSingleInput(bh: string, option: string, e: any) {
	if (!answersOther[bh]) answersOther[bh] = {}
	answersOther[bh][option] = e.detail.value
}

function onOtherMultipleInput(bh: string, option: string, e: any) {
	if (!answersOther[bh]) answersOther[bh] = {}
	answersOther[bh][option] = e.detail.value
}

function answersRefill() {
	Object.keys(answers).forEach(k => delete answers[k])
	Object.keys(answersOptions).forEach(k => delete answersOptions[k])
	Object.keys(answersOther).forEach(k => delete answersOther[k])
	Object.keys(progressed).forEach(k => delete progressed[k])
}

onMounted(() => {
	fetchQuestions()
})
</script>

<style lang="scss" scoped>
.q-wrap {
	min-height: 100vh;
	background-color: #f6f7fa;
	padding: 24rpx;
}

.q-header {
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	margin-bottom: 24rpx;

	.q-title {
		font-size: 36rpx;
		font-weight: bold;
		display: block;
		margin-bottom: 16rpx;
	}

	.q-desc {
		font-size: 28rpx;
		color: #666;
	}
}

.q-status {
	text-align: center;
	padding: 100rpx;
	color: #999;
	font-size: 28rpx;
}

.q-body {
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
	position: relative;
}

.q-question-header {
	margin-bottom: 24rpx;
}

.q-type-tag {
	display: inline-block;
	padding: 8rpx 24rpx;
	background: #e8f0ff;
	color: #3c9cff;
	border-radius: 8rpx;
	font-size: 24rpx;
}

.q-question {
	margin-bottom: 32rpx;
}

.q-required {
	color: #f56c6c;
	margin-right: 8rpx;
}

.q-question-text {
	font-size: 32rpx;
	line-height: 1.6;
}

.q-field {
	margin-bottom: 32rpx;
}

.q-option-wrapper {
	margin-bottom: 24rpx;
}

.q-option {
	display: flex;
	align-items: center;
	font-size: 28rpx;
}

.q-input {
	width: 100%;
	height: 80rpx;
	border: 1rpx solid #eee;
	border-radius: 8rpx;
	padding: 0 24rpx;
	margin-top: 12rpx;
}

.q-input-other {
	border-color: #dcdfe6;
}

.q-textarea {
	width: 100%;
	min-height: 200rpx;
	border: 1rpx solid #eee;
	border-radius: 8rpx;
	padding: 24rpx;
	box-sizing: border-box;
}

.q-error {
	color: #f56c6c;
	font-size: 24rpx;
	margin-top: 12rpx;
	display: block;
}

.q-actions {
	display: flex;
	gap: 24rpx;

	.q-btn {
		flex: 1;
	}
}

.q-view-float {
	position: fixed;
	right: 40rpx;
	bottom: 200rpx;
	width: 80rpx;
	height: 80rpx;
	background: #3c9cff;
	color: #fff;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	box-shadow: 0 8rpx 24rpx rgba(60, 156, 255, 0.3);
	z-index: 100;
}

.q-review {
	background: #fff;
	border-radius: 16rpx;
	padding: 32rpx;
}

.q-review-list {
	max-height: 60vh;
}

.q-review-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.q-review-no {
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 24rpx;
	margin-right: 24rpx;
}

.q-review-no--filled {
	background: #3c9cff;
	color: #fff;
}

.q-review-no--empty {
	background: #eee;
	color: #999;
}

.q-review-main {
	flex: 1;
}

.q-truncate {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.q-review-question {
	font-size: 28rpx;
	margin-bottom: 8rpx;
}

.q-review-answer {
	font-size: 24rpx;
	color: #666;
}

.q-review-actions {
	margin-top: 32rpx;
}
</style>