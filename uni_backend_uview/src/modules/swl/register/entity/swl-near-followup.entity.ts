import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 近期随访 */
@Entity({ name: 'tswl_near_followup', schema: 'swl' })
export class SwlNearFollowup {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'sequence_no', type: 'int' }) sequenceNo: number;
  @Column({ type: 'int' }) episode: number;
  @Column({ name: 'followup_date', type: 'date', nullable: true, comment: '随访日期' }) followupDate: Date;
  @Column({ name: 'followup_count', type: 'int', comment: '随访次数' }) followupCount: number;
  @Column({ name: 'postop_days', type: 'int', nullable: true, comment: '术后天数' }) postopDays: number;
  @Column({ name: 'gross_hematuria', length: 30, nullable: true, comment: '末期肉眼血尿' }) grossHematuria: string;
  @Column({ type: 'smallint', default: 0, comment: '发热 0-无 1-有' }) fever: number;
  @Column({ type: 'smallint', default: 0, comment: '恶心' }) nausea: number;
  @Column({ type: 'smallint', default: 0, comment: '呕吐' }) vomiting: number;
  @Column({ name: 'skin_ecchymosis', type: 'smallint', default: 0, comment: '皮肤渗血或瘀斑' }) skinEcchymosis: number;
  @Column({ name: 'subcapsular_hematoma', type: 'smallint', default: 0, comment: '肾包膜下血肿' }) subcapsularHematoma: number;
  @Column({ name: 'renal_hemorrhage', type: 'smallint', default: 0, comment: '肾出血' }) renalHemorrhage: number;
  @Column({ type: 'smallint', default: 0, comment: '感染' }) infection: number;
  @Column({ name: 'renal_colic', type: 'smallint', default: 0, comment: '肾绞痛' }) renalColic: number;
  @Column({ name: 'renal_failure', type: 'smallint', default: 0, comment: '肾衰' }) renalFailure: number;
  @Column({ name: 'flank_pain_level', length: 30, nullable: true, comment: '腰腹痛程度' }) flankPainLevel: string;
  @Column({ name: 'steinstrasse_type', length: 30, nullable: true, comment: '石街类型' }) steinstrasseType: string;
  @Column({ name: 'steinstrasse_length', type: 'float', nullable: true, comment: '石街长度(cm)' }) steinstrasseLength: number;
  @Column({ name: 'stone_pass_days', length: 20, nullable: true, comment: '排石时间(天)' }) stonePassDays: string;
  @Column({ name: 'stone_output_level', length: 30, nullable: true, comment: '排石量评估' }) stoneOutputLevel: string;
  @Column({ name: 'stone_free', type: 'smallint', default: 0, comment: '无石' }) stoneFree: number;
  @Column({ name: 'residual_stone', type: 'smallint', default: 0, comment: '残余结石' }) residualStone: number;
  @Column({ name: 'stone_size', length: 50, nullable: true, comment: '残余结石大小' }) stoneSize: string;
  @Column({ name: 'imaging_findings', type: 'text', nullable: true, comment: '影像学发现' }) imagingFindings: string;
  @Column({ length: 20, nullable: true, comment: '随访医生' }) physician: string;
  @Column({ length: 30, nullable: true, comment: '内科辅助治疗' }) medicalTherapy: string;
  @Column({ name: 'pre_swl_therapy', length: 30, nullable: true, comment: 'SWL前治疗性辅助' }) preSWLTherapy: string;
  @Column({ name: 'post_swl_therapy', length: 30, nullable: true, comment: 'SWL后治疗性辅助' }) postSWLTherapy: string;
  @Column({ name: 'post_swl_support', length: 30, nullable: true, comment: 'SWL后补助性辅助' }) postSWLSupport: string;
  @Column({ name: 'analysis_method', length: 50, nullable: true, comment: '分析方法' }) analysisMethod: string;
  @Column({ length: 30, nullable: true, comment: '疗效评定' }) effectiveness: string;
  @Column({ name: 'antibiotics_used', type: 'smallint', default: 0, comment: '抗生素使用' }) antibioticsUsed: number;
  @Column({ name: 'antibiotics_note', length: 100, nullable: true, comment: '抗生素说明' }) antibioticsNote: string;
  @Column({ name: 'us_finding', type: 'text', nullable: true, comment: 'B超结果描述' }) usFinding: string;
  @Column({ name: 'kub_finding', type: 'text', nullable: true, comment: 'KUB结果描述' }) kubFinding: string;
  @Column({ name: 'other_finding', type: 'text', nullable: true, comment: '其他检查结果' }) otherFinding: string;
  @Column({ length: 30, nullable: true, comment: '结石成分一' }) component1: string;
  @Column({ name: 'component1_percent', length: 10, nullable: true, comment: '成分一百分比' }) component1Percent: string;
  @Column({ length: 30, nullable: true, comment: '结石成分二' }) component2: string;
  @Column({ name: 'component2_percent', length: 10, nullable: true, comment: '成分二百分比' }) component2Percent: string;
  @Column({ length: 30, nullable: true, comment: '结石成分三' }) component3: string;
  @Column({ name: 'component3_percent', length: 10, nullable: true, comment: '成分三百分比' }) component3Percent: string;
  @Column({ length: 30, nullable: true, comment: '结石成分四' }) component4: string;
  @Column({ name: 'component4_percent', length: 10, nullable: true, comment: '成分四百分比' }) component4Percent: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
