import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者个人史 */
@Entity({ name: 'tswl_personal_history', schema: 'swl' })
export class SwlPersonalHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50, nullable: true }) serialNumber: string;
  @Column({ length: 20, nullable: true, comment: '出生地' }) birthplace: string;
  @Column({ length: 20, nullable: true, comment: '居住地' }) residence: string;
  @Column({ name: 'start_residence_date', length: 30, nullable: true, comment: '起始居住年月' })
  startResidenceDate: string;
  @Column({ name: 'occupation', length: 50, nullable: true, comment: '职业' }) occupation: string;
  @Column({ name: 'smoking_history', length: 50, nullable: true, comment: '吸烟史' }) smokingHistory: string;
  @Column({ name: 'drinking_history', length: 50, nullable: true, comment: '饮酒史' }) drinkingHistory: string;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
