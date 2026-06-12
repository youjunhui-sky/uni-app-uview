import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者既往史 */
@Entity({ name: 'tswl_past_medical_history', schema: 'swl' })
export class SwlPastMedicalHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50, nullable: true }) serialNumber: string;
  @Column({ name: 'disease_name', length: 50, nullable: true, comment: '病名-字典past_sickname' })
  diseaseName: string;
  @Column({ name: 'diagnosis_date', length: 30, nullable: true, comment: '诊断年月(YYYY-MM)' })
  diagnosisDate: string;
  @Column({ length: 50, nullable: true, comment: '治疗方式-字典past_curestatus' })
  treatment: string;
  @Column({ name: 'is_cured', type: 'smallint', default: 0, nullable: true, comment: '是否治愈 0-否 1-是' })
  isCured: number;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
