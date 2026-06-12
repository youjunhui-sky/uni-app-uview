import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者体征 */
@Entity({ name: 'tswl_vital_signs', schema: 'swl' })
export class SwlVitalSigns {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ type: 'float', nullable: true, comment: '体温(℃)' }) temperature: number;
  @Column({ type: 'int', nullable: true, comment: '脉搏(次/分)' }) pulse: number;
  @Column({ name: 'respiratory_rate', type: 'int', nullable: true, comment: '呼吸频率(次/分)' }) respiratoryRate: number;
  @Column({ name: 'blood_pressure', length: 20, nullable: true, comment: '血压(mmHg)' }) bloodPressure: string;
  @Column({ type: 'float', nullable: true, comment: '身高(cm)' }) height: number;
  @Column({ type: 'float', nullable: true, comment: '体重(kg)' }) weight: number;
  @Column({ type: 'float', nullable: true, comment: 'BMI' }) bmi: number;
  @Column({ name: 'abdominal_tenderness', length: 30, nullable: true, comment: '腹部压痛点' }) abdominalTenderness: string;
  @Column({ length: 30, nullable: true, comment: '位置' }) location: string;
  @Column({ name: 'renal_area_knocking_pain', length: 20, nullable: true, comment: '肾区叩击痛' }) renalAreaKnockingPain: string;
  @Column({ name: 'pain_intensity', length: 30, nullable: true, comment: '程度' }) painIntensity: string;
  @Column({ name: 'other_signs', type: 'text', nullable: true, comment: '其他体征' }) otherSigns: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
