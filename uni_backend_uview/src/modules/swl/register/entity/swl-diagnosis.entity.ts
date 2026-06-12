import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 诊疗诊断 */
@Entity({ schema: 'swl', name: 'tswl_diagnosis' })
export class SwlDiagnosis {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'diagnosis_code', type: 'text', nullable: true, comment: '诊断结论' }) diagnosisCode: string;
  @Column({ name: 'treatment_plan', type: 'text', nullable: true, comment: '治疗方案' }) treatmentPlan: string;
  @Column({ length: 20, nullable: true, comment: '诊断医生' }) doctor: string;
  @Column({ name: 'diagnosis_time', type: 'timestamp', nullable: true, comment: '临床诊断时间' }) diagnosisTime: Date;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
