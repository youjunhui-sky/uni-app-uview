import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** 患者家族史 */
@Entity({ name: 'tswl_family_history', schema: 'swl' })
export class SwlFamilyHistory {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50, nullable: true }) serialNumber: string;
  @Column({ name: 'family_member', length: 20, nullable: true, comment: '家族成员-字典family_people' })
  familyMember: string;
  @Column({ name: 'urolithiasis_history', type: 'smallint', default: 0, comment: '尿石病史 0-无 1-有' })
  urolithiasisHistory: number;
  @Column({ name: 'other_diseases', length: 50, nullable: true, comment: '其他病史-字典family_othersick' })
  otherDiseases: string;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
