import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者现病史 */
@Entity({ name: 'tswl_current_history', schema: 'swl' })
export class SwlCurrentHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'has_symptom', type: 'smallint', default: 0, nullable: true, comment: '症状 0-无 1-有' })
  hasSymptom: number;
  @Column({ name: 'disease_duration', type: 'integer', nullable: true, comment: '病程(天)' })
  diseaseDuration: number;
  @Column({ name: 'chief_complaint', type: 'text', nullable: true, comment: '主诉' })
  chiefComplaint: string;
  @Column({ name: 'has_fever', type: 'smallint', default: 0, nullable: true }) hasFever: number;
  @Column({ name: 'has_vomit', type: 'smallint', default: 0, nullable: true }) hasVomit: number;
  @Column({ name: 'has_nausea', type: 'smallint', default: 0, nullable: true }) hasNausea: number;
  @Column({ name: 'has_frequent_urination', type: 'smallint', default: 0, nullable: true }) hasFrequentUrination: number;
  @Column({ name: 'has_urgent_urination', type: 'smallint', default: 0, nullable: true }) hasUrgentUrination: number;
  @Column({ name: 'has_dysuria', type: 'smallint', default: 0, nullable: true }) hasDysuria: number;
  @Column({ name: 'has_lower_abdominal_pain', type: 'smallint', default: 0, nullable: true }) hasLowerAbdominalPain: number;
  @Column({ name: 'renal_colic_location', length: 20, nullable: true, comment: '肾绞痛部位' })
  renalColicLocation: string;
  @Column({ name: 'renal_colic_character', length: 20, nullable: true, comment: '肾绞痛特征' })
  renalColicCharacter: string;
  @Column({ name: 'renal_colic_count', length: 20, nullable: true, comment: '肾绞痛发作次数' })
  renalColicCount: string;
  @Column({ name: 'has_chronic_backache', length: 50, nullable: true, comment: '慢性腰痛' })
  hasChronicBackache: string;
  @Column({ name: 'has_hematuria', length: 50, nullable: true, comment: '血尿' })
  hasHematuria: string;
  @Column({ name: 'difficulty_urinating', length: 50, nullable: true, comment: '排尿困难' })
  difficultyUrinating: string;
  @Column({ length: 50, nullable: true, comment: '治疗方式' }) treatment: string;
  @Column({ name: 'treatment_process', type: 'text', nullable: true, comment: '治疗经过' })
  treatmentProcess: string;
  @Column({ name: 'other_symptoms', type: 'text', nullable: true, comment: '其他症状' })
  otherSymptoms: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
