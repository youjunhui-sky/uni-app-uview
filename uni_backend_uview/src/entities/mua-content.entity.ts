import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 代谢评估内容表（对齐 mdp 库 mua.tetiology_mua_content）
 * 注：原 swlNo 在 mdp 中已重命名为 muaNo
 */
@Entity({
  name: 'tetiology_mua_content',
  schema: 'mua',
  comment: '代谢评估内容表',
})
export class MuaContentEntity {
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

  @Column({ name: 'assessment_type', comment: '评估类型', length: 10, nullable: true })
  assessmentType: string;

  @Column({ name: 'assessment_result', comment: '评估结果', type: 'text', nullable: true })
  assessmentResult: string;

  @Column({ name: 'treatment_suggestion', comment: '诊疗建议', type: 'text', nullable: true })
  treatmentSuggestion: string;

  @Column({ name: 'guide_suggestion', comment: '治疗防治建议', type: 'text', nullable: true })
  guideSuggestion: string;

  @Column({ name: 'ai_guide_suggestion', comment: 'AI治疗防治建议', type: 'text', nullable: true })
  aiGuideSuggestion: string;

  @Column({ comment: '评估医生', length: 20, nullable: true })
  doctor: string;

  @Column({ comment: '填表人', length: 20, nullable: true })
  operator: string;

  @Column({ comment: '疾病检查结果', type: 'text', nullable: true })
  jbjx: string;
}
