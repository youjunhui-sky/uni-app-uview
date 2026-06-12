import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 代谢评估信息表（对齐 mdp 库 mua.tetiology_mua_info）
 * 注：原 swlNo 在 mdp 中已重命名为 muaNo
 */
@Entity({
  name: 'tetiology_mua_info',
  schema: 'mua',
  comment: '代谢评估信息表',
})
export class MuaInfoEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Column({ name: 'patient_no', comment: '档案号', length: 20 })
  patientNo: string;

  /** mdp 重命名: swl_no → mua_no */
  @Column({ name: 'mua_no', comment: '碎石号', length: 20, nullable: true })
  muaNo: string;

  @Column({ name: 'serial_number', comment: '流水号', length: 50, nullable: true })
  serialNumber: string;

  @Column({ name: 'assessment_count', comment: '评估次数', type: 'int', nullable: true })
  assessmentCount: number;

  @Column({ name: 'outpatient_no', comment: '门诊号', length: 20, nullable: true })
  outpatientNo: string;

  @Column({ name: 'inpatient_no', comment: '住院号', length: 20, nullable: true })
  inpatientNo: string;

  @Column({ name: 'bed_no', comment: '病床号', length: 20, nullable: true })
  bedNo: string;

  /** mdp 长度 50（原 30） */
  @Column({ comment: '就诊科室', length: 50, nullable: true })
  department: string;

  @Column({ comment: '年龄', length: 10, nullable: true })
  age: string;

  @Column({ name: 'assessment_date', comment: '评估日期', type: 'date', nullable: true })
  assessmentDate: Date;

  @Column({ comment: '身高(cm)', type: 'double precision', nullable: true })
  height: number;

  @Column({ comment: '体重(kg)', type: 'double precision', nullable: true })
  weight: number;

  @Column({ comment: 'BMI指数', type: 'double precision', nullable: true })
  bmi: number;

  @Column({ name: 'stone_history', comment: '结石病史', type: 'text', nullable: true })
  stoneHistory: string;

  @Column({ name: 'family_history', comment: '家族史', type: 'text', nullable: true })
  familyHistory: string;

  @Column({ name: 'other_history', comment: '其他病史', type: 'text', nullable: true })
  otherHistory: string;

  @Column({ name: 'has_ultrasound', comment: '是否超声', type: 'smallint', nullable: true })
  hasUltrasound: number;

  @Column({ name: 'has_kub', comment: '是否KUB', type: 'smallint', nullable: true })
  hasKUB: number;

  @Column({ name: 'has_ct', comment: '是否CT', type: 'smallint', nullable: true })
  hasCT: number;

  @Column({ name: 'has_mri', comment: '是否MRI', type: 'smallint', nullable: true })
  hasMRI: number;

  @Column({ name: 'has_ctu', comment: '是否CTU', type: 'smallint', nullable: true })
  hasCTU: number;

  @Column({ name: 'has_ivu', comment: '是否IVU', type: 'smallint', nullable: true })
  hasIVU: number;

  @Column({ name: 'image_diagnosis', comment: '影像诊断', type: 'text', nullable: true })
  imageDiagnosis: string;

  @Column({ name: 'anatomical_abnormal', comment: '解剖异常', length: 50, nullable: true })
  anatomicalAbnormal: string;

  @Column({ comment: '评估医生', length: 20, nullable: true })
  doctor: string;

  @Column({ comment: '填表人', length: 20, nullable: true })
  operator: string;

  @Column({ name: 'ct_value', comment: 'CT值', type: 'double precision', nullable: true })
  ctValue: number;

  @Column({ comment: 'KUB', length: 50, nullable: true })
  kub: string;

  @Column({ name: 'stone_comp', comment: '结石成分', length: 50, nullable: true })
  stoneComp: string;

  @Column({ name: 'other_stone_comp', comment: '其他结石成分', length: 200, nullable: true })
  otherStoneComp: string;

  @Column({ comment: '成分一', length: 30, nullable: true })
  component1: string;

  @Column({ name: 'component1_percent', comment: '成分一占比', type: 'double precision', nullable: true })
  component1Percent: number;

  @Column({ comment: '成分二', length: 30, nullable: true })
  component2: string;

  @Column({ name: 'component2_percent', comment: '成分二占比', type: 'double precision', nullable: true })
  component2Percent: number;

  @Column({ comment: '成分三', length: 30, nullable: true })
  component3: string;

  @Column({ name: 'component3_percent', comment: '成分三占比', type: 'double precision', nullable: true })
  component3Percent: number;

  @Column({ comment: '成分四', length: 30, nullable: true })
  component4: string;

  @Column({ name: 'component4_percent', comment: '成分四占比', type: 'double precision', nullable: true })
  component4Percent: number;

  @Column({ name: 'stone_location', comment: '结石位置描述', length: 50, nullable: true })
  stoneLocation: string;

  @Column({ name: 'analysis_method', comment: '分析方法', length: 30, nullable: true })
  analysisMethod: string;

  @Column({ name: 'analysis_date', comment: '分析日期', type: 'date', nullable: true })
  analysisDate: Date;

  @Column({ name: 'deleted_at', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'assessment_type', comment: '评估类型', length: 20, nullable: true })
  assessmentType: string;

  /** mdp 新增列 */
  @Column({ comment: '性别', type: 'int', nullable: true })
  gender: number;

  /** mdp 新增列 */
  @Column({ name: 'anatomy_abnormality', comment: '解剖异常详情', type: 'text', nullable: true })
  anatomyAbnormality: string;

  @Column({ name: 'tenant_id', comment: '租户ID', type: 'int', nullable: true })
  tenantId: number;
}
