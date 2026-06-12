import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者既往结石病史 */
@Entity({ name: 'tswl_past_stone_history', schema: 'swl' })
export class SwlPastStoneHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50, nullable: true }) serialNumber: string;
  @Column({ name: 'diagnosis_date', length: 30, nullable: true, comment: '诊断年月' })
  diagnosisDate: string;
  @Column({ length: 50, nullable: true, comment: '诊断-字典lithiasis_diagnose' })
  diagnosis: string;
  @Column({ name: 'treatment_process', length: 50, nullable: true, comment: '治疗过程-字典lithiasis_process' })
  treatmentProcess: string;
  @Column({ name: 'curative_effect', length: 50, nullable: true, comment: '疗效-字典lithiasis_cureresult' })
  curativeEffect: string;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
