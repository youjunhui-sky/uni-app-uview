import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者月经婚育史（仅女性） */
@Entity({ name: 'tswl_menstrual_marriage_history', schema: 'swl' })
export class SwlMenstrualMarriageHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50, nullable: true }) serialNumber: string;
  @Column({ name: 'menarche_age', length: 10, nullable: true, comment: '初潮年龄(岁)' }) menarcheAge: string;
  @Column({ name: 'menstrual_cycle', length: 10, nullable: true, comment: '周期(天)' }) menstrualCycle: string;
  @Column({ name: 'menstrual_period', length: 10, nullable: true, comment: '经期(天)' }) menstrualPeriod: string;
  @Column({ name: 'marital_status', length: 10, nullable: true, comment: '婚姻状况' }) maritalStatus: string;
  @Column({ name: 'parity', length: 10, nullable: true, comment: '生育次数' }) parity: string;
  @Column({ name: 'abortion', length: 10, nullable: true, comment: '流产次数' }) abortion: string;
  @Column({ type: 'smallint', default: 0, comment: '是否绝经 0-否 1-是' }) menopause: number;
  @Column({ name: 'last_menstrual_date', type: 'date', nullable: true, comment: '末次月经' }) lastMenstrualDate: Date;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
