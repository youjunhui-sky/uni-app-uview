import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 远期随访 */
@Entity({ name: 'tswl_future_followup', schema: 'swl' })
export class SwlFutureFollowup {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'sequence_no', type: 'int' }) sequenceNo: number;
  @Column({ type: 'int' }) episode: number;
  @Column({ name: 'followup_date', type: 'date', nullable: true }) followupDate: Date;
  @Column({ name: 'followup_count', type: 'int' }) followupCount: number;
  @Column({ name: 'last_swl_months', type: 'int', nullable: true, comment: '末次SWL术后月数' }) lastSWLMonths: number;
  @Column({ name: 'total_swl_times', type: 'int', default: 0, nullable: true, comment: '总SWL次数' }) totalSWLTimes: number;
  @Column({ name: 'treated_stones', length: 50, default: '无', nullable: true, comment: '已治疗结石' }) treatedStones: string;
  @Column({ name: 'untreated_stones', length: 50, default: '无', nullable: true, comment: '未治疗结石' }) untreatedStones: string;
  @Column({ name: 'mild_atrophy', type: 'smallint', default: 0, comment: '轻度肾萎缩' }) mildAtrophy: number;
  @Column({ name: 'moderate_atrophy', type: 'smallint', default: 0, comment: '中度肾萎缩' }) moderateAtrophy: number;
  @Column({ name: 'severe_atrophy', type: 'smallint', default: 0, comment: '重度肾萎缩' }) severeAtrophy: number;
  @Column({ name: 'perirenal_fluid', type: 'smallint', default: 0, comment: '肾周积液' }) perirenalFluid: number;
  @Column({ name: 'renal_function_loss', type: 'smallint', default: 0, comment: '肾功能丧失' }) renalFunctionLoss: number;
  @Column({ name: 'collecting_system_stricture', type: 'smallint', default: 0, comment: '集合系统狭窄' }) collectingSystemStricture: number;
  @Column({ name: 'ureteral_stricture', type: 'smallint', default: 0, comment: '输尿管狭窄' }) ureteralStricture: number;
  @Column({ name: 'renal_impairment', type: 'smallint', default: 0, comment: '肾功能损害' }) renalImpairment: number;
  @Column({ name: 'recurrent_uti', type: 'smallint', default: 0, comment: '复发性尿路感染' }) recurrentUTI: number;
  @Column({ name: 'growth_disorder', type: 'smallint', default: 0, comment: '儿童生长发育障碍' }) growthDisorder: number;
  @Column({ name: 'baseline_bp', length: 20, nullable: true, comment: '基础血压' }) baselineBP: string;
  @Column({ name: 'bp_change', length: 50, nullable: true, comment: '血压变化' }) bpChange: string;
  @Column({ name: 'live_habit_change', length: 50, nullable: true, comment: '生活习惯' }) liveHabitChange: string;
  @Column({ name: 'water_habit_change', length: 50, nullable: true, comment: '饮水量变化' }) waterHabitChange: string;
  @Column({ name: 'daily_water_intake', length: 20, nullable: true, comment: '每日饮水量(ml/d)' }) dailyWaterIntake: string;
  @Column({ name: 'occupational_change', type: 'smallint', default: 0, comment: '职业是否改变' }) occupationalChange: number;
  @Column({ name: 'occupational_risk', length: 50, nullable: true, comment: '职业风险暴露' }) occupationalRisk: string;
  @Column({ name: 'blood_abnormalities', type: 'text', nullable: true, comment: '血液异常指标' }) bloodAbnormalities: string;
  @Column({ name: 'urine_abnormalities', type: 'text', nullable: true, comment: '尿液异常指标' }) urineAbnormalities: string;
  @Column({ name: 'ivu_finding', type: 'text', nullable: true, comment: 'IVU结果' }) ivuFinding: string;
  @Column({ name: 'ect_finding', type: 'text', nullable: true, comment: 'ECT结果' }) ectFinding: string;
  @Column({ name: 'us_finding', type: 'text', nullable: true, comment: 'B超结果' }) usFinding: string;
  @Column({ name: 'kub_finding', type: 'text', nullable: true, comment: 'KUB结果' }) kubFinding: string;
  @Column({ name: 'other_finding', type: 'text', nullable: true, comment: '其他检查结果' }) otherFinding: string;
  @Column({ length: 20, nullable: true, comment: '随访医生' }) physician: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
