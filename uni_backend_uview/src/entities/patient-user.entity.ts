import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 就诊人关联实体（对齐 mdp 库 base.tpatient_user）
 * 注：tpatient_user 在 mdp 中不存在，对应 DDL 见 mdp-diff.md 第六节
 */
@Entity({
  name: 'tpatient_user',
  schema: 'base',
  comment: '就诊人关联',
})
export class PatientUserEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  /** 业务字段统一 snake_case */
  @Column({ name: 'patient_no', comment: '档案号', length: 20 })
  patientNo: string;

  @Column({ name: 'user_id', comment: '用户ID', type: 'int' })
  userId: number;

  @Column({ name: 'default', comment: '是否默认 0-否 1-是', type: 'int', default: 0 })
  default: number;
}
