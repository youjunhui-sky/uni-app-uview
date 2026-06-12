import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * SWL 就诊登记实体
 * 对应表 swl.tswl_register（与 PC 端 multi-disease-platform 对齐）
 */
@Entity({ name: 'tswl_register', schema: 'swl' })
export class SwlRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'patient_no', length: 20, comment: '档案号' })
  patientNo: string;

  @Column({ name: 'swl_no', length: 20, comment: '碎石号' })
  swlNo: string;

  @Column({ name: 'serial_number', length: 50, comment: '流水号' })
  serialNumber: string;

  @Column({ length: 50, nullable: true, comment: '就诊科室' })
  department: string;

  @Column({
    name: 'visit_date',
    type: 'date',
    nullable: true,
    comment: '就诊日期',
  })
  visitDate: Date;

  @Column({ name: 'outpatient_no', length: 20, nullable: true, comment: '门诊号' })
  outpatientNo: string;

  @Column({ name: 'inpatient_no', length: 20, nullable: true, comment: '住院号' })
  inpatientNo: string;

  @Column({ name: 'bed_no', length: 20, nullable: true, comment: '病床号' })
  bedNo: string;

  @Column({ length: 10, nullable: true, comment: '年龄' })
  age: string;

  @Column({ name: 'sequence_no', type: 'int', default: 1, comment: '序列号' })
  sequenceNo: number;

  @Column({ type: 'int', default: 1, comment: '期数' })
  episode: number;

  @Column({ name: 'height', type: 'float', nullable: true, comment: '身高(cm)' })
  height: number;

  @Column({ name: 'weight', type: 'float', nullable: true, comment: '体重(kg)' })
  weight: number;

  @Column({ type: 'float', nullable: true, comment: 'BMI指数' })
  bmi: number;

  @Column({
    name: 'special_condition',
    type: 'text',
    nullable: true,
    comment: '特殊病情/禁忌症',
  })
  specialCondition: string;

  @Column({ length: 20, nullable: true, comment: '接诊医生' })
  doctor: string;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: '删除时间',
  })
  deletedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '机构ID' })
  orgId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'created_by', type: 'varchar', length: 50, nullable: true, comment: '创建人' })
  createdBy: string;
}
