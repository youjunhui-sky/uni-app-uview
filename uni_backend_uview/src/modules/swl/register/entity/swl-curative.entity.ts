import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 疗效评定 */
@Entity({ name: 'tswl_curative_visit', schema: 'swl' })
export class SwlCurative {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'followup_date', type: 'date', nullable: true }) followupDate: Date;
  @Column({ name: 'postop_days', type: 'integer', default: 0, nullable: true, comment: '术后天数' }) postopDays: number;
  @Column({ name: 'gross_hematuria', length: 30, nullable: true, comment: '末期肉眼血尿' }) grossHematuria: string;
  @Column({ type: 'smallint', default: 0, comment: '发热' }) fever: number;
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
  @Column({ name: 'steinstrasse_length', type: 'float', nullable: true, comment: '石街长度' }) steinstrasseLength: number;
  @Column({ name: 'stone_pass_days', length: 20, nullable: true, comment: '排石时间' }) stonePassDays: string;
  @Column({ name: 'stone_output_level', length: 30, nullable: true, comment: '排石量评估' }) stoneOutputLevel: string;
  @Column({ length: 30, nullable: true, comment: '内科辅助治疗' }) medicalTherapy: string;
  @Column({ name: 'pre_swl_therapy', length: 50, nullable: true, comment: 'SWL前治疗性辅助' }) preSWLTherapy: string;
  @Column({ name: 'post_swl_therapy', length: 50, nullable: true, comment: 'SWL后治疗性辅助' }) postSWLTherapy: string;
  @Column({ name: 'post_swl_support', length: 50, nullable: true, comment: 'SWL后补助性辅助' }) postSWLSupport: string;
  @Column({ length: 30, nullable: true, comment: '成分一' }) component1: string;
  @Column({ name: 'component1_percent', type: 'float', nullable: true, comment: '成分一百分比' }) component1Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分二' }) component2: string;
  @Column({ name: 'component2_percent', type: 'float', nullable: true }) component2Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分三' }) component3: string;
  @Column({ name: 'component3_percent', type: 'float', nullable: true }) component3Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分四' }) component4: string;
  @Column({ name: 'component4_percent', type: 'float', nullable: true }) component4Percent: number;
  @Column({ name: 'antibiotics_used', type: 'smallint', nullable: true, comment: '抗生素使用' }) antibioticsUsed: number;
  @Column({ name: 'antibiotics_note', type: 'text', nullable: true, comment: '抗生素说明' }) antibioticsNote: string;
  @Column({ name: 'analysis_method', length: 30, nullable: true, comment: '成分分析方法' }) analysisMethod: string;
  @Column({ length: 30, nullable: true, comment: '疗效评定' }) effectiveness: string;
  @Column({ name: 'curative_param_stone_free', type: 'smallint', default: 0, comment: '无石' }) curativeParamStoneFree: number;
  @Column({ name: 'curative_param_initial_shock', type: 'smallint', default: 0, comment: '初震参数' }) curativeParamInitialShock: number;
  @Column({ name: 'curative_param_repeat_shock', type: 'smallint', default: 0, comment: '复震参数' }) curativeParamRepeatShock: number;
  @Column({ name: 'curative_param_pre_swl', type: 'smallint', default: 0, comment: 'SWL前辅助' }) curativeParamPreSWL: number;
  @Column({ name: 'curative_param_post_swl_therapy', type: 'smallint', default: 0, comment: 'SWL后治疗辅助' }) curativeParamPostSWLTherapy: number;
  @Column({ name: 'curative_param_post_swl_support', type: 'smallint', default: 0, comment: 'SWL后补助辅助' }) curativeParamPostSWLSupport: number;
  // 代谢异常
  @Column({ name: 'metabolic_gout', type: 'smallint', default: 0, comment: '痛风' }) metabolicGout: number;
  @Column({ name: 'metabolic_rta', type: 'smallint', default: 0, comment: '肾小管酸中毒' }) metabolicRTA: number;
  @Column({ name: 'metabolic_hypophosphatemia', type: 'smallint', default: 0, comment: '低磷血症' }) metabolicHypophosphatemia: number;
  @Column({ name: 'metabolic_hyperoxaluria', type: 'smallint', default: 0, comment: '高草酸尿' }) metabolicHyperoxaluria: number;
  @Column({ name: 'metabolic_hyperparathyroidism', type: 'smallint', default: 0, comment: '甲旁亢' }) metabolicHyperparathyroidism: number;
  @Column({ name: 'metabolic_hypernatriuria', type: 'smallint', default: 0, comment: '高钠尿' }) metabolicHypernatriuria: number;
  @Column({ name: 'metabolic_alkaline_urine', type: 'smallint', default: 0, comment: '碱性尿' }) metabolicAlkalineUrine: number;
  @Column({ name: 'metabolic_hypercalciuria', type: 'smallint', default: 0, comment: '高钙尿' }) metabolicHypercalciuria: number;
  @Column({ name: 'metabolic_hypomagnesuria', type: 'smallint', default: 0, comment: '低镁尿' }) metabolicHypomagnesuria: number;
  @Column({ name: 'metabolic_hyperuricosuria', type: 'smallint', default: 0, comment: '高尿酸尿' }) metabolicHyperuricosuria: number;
  @Column({ name: 'metabolic_hypocitraturia', type: 'smallint', default: 0, comment: '低枸橼酸尿' }) metabolicHypocitraturia: number;
  @Column({ name: 'metabolic_cystinuria', type: 'smallint', default: 0, comment: '胱氨酸尿' }) metabolicCystinuria: number;
  @Column({ name: 'metabolic_unknown', type: 'smallint', default: 0, comment: '不明确' }) metabolicUnknown: number;
  // 局部解剖异常
  @Column({ name: 'local_sponge_kidney', type: 'smallint', default: 0, comment: '海绵肾' }) localSpongeKidney: number;
  @Column({ name: 'local_horseshoe_kidney', type: 'smallint', default: 0, comment: '马蹄肾' }) localHorseshoeKidney: number;
  @Column({ name: 'local_renal_cyst', type: 'smallint', default: 0, comment: '肾囊肿' }) localRenalCyst: number;
  @Column({ name: 'local_duplex_kidney', type: 'smallint', default: 0, comment: '重复肾' }) localDuplexKidney: number;
  @Column({ name: 'local_bph', type: 'smallint', default: 0, comment: 'BPH' }) localBPH: number;
  @Column({ name: 'local_upj_stricture', type: 'smallint', default: 0, comment: 'UPJ狭窄' }) localUPJStricture: number;
  @Column({ name: 'local_polycystic_kidney', type: 'smallint', default: 0, comment: '多囊肾' }) localPolycysticKidney: number;
  @Column({ name: 'local_urethral_stricture', type: 'smallint', default: 0, comment: '尿道狭窄' }) localUrethralStricture: number;
  @Column({ name: 'local_urethral_foreign_body', type: 'smallint', default: 0, comment: '尿道异物' }) localUrethralForeignBody: number;
  @Column({ name: 'local_ureteral_stricture', type: 'smallint', default: 0, comment: '输尿管狭窄' }) localUreteralStricture: number;
  @Column({ name: 'local_ectopic_kidney', type: 'smallint', default: 0, comment: '异位肾' }) localEctopicKidney: number;
  @Column({ name: 'local_bladder_diverticulum', type: 'smallint', default: 0, comment: '膀胱憩室' }) localBladderDiverticulum: number;
  @Column({ name: 'local_neurogenic_bladder', type: 'smallint', default: 0, comment: '神经源性膀胱' }) localNeurogenicBladder: number;
  @Column({ name: 'local_calyeal_diverticulum', type: 'smallint', default: 0, comment: '肾盏憩室' }) localCalycealDiverticulum: number;
  @Column({ name: 'local_ureterocele', type: 'smallint', default: 0, comment: '输尿管囊肿' }) localUreterocele: number;
  @Column({ name: 'local_other', type: 'smallint', default: 0, comment: '其他' }) localOther: number;
  // 影像
  @Column({ name: 'us_finding', type: 'text', nullable: true, comment: 'B超结果' }) usFinding: string;
  @Column({ name: 'kub_finding', type: 'text', nullable: true, comment: 'KUB结果' }) kubFinding: string;
  @Column({ name: 'other_finding', type: 'text', nullable: true, comment: '其他结果' }) otherFinding: string;
  @Column({ length: 20, nullable: true, comment: '随访医生' }) physician: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
