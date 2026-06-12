import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 结石成分分析记录实体
 * 与 PC 端 multi-disease-platform 对齐
 */
@Entity({
  name: 'tswl_stone_component',
  schema: 'swl',
  comment: '结石成分分析记录',
})
export class StoneComponentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'patient_no',
    comment: '档案号',
    length: 20,
    nullable: false,
  })
  patientNo: string;

  @Column({ name: 'swl_no', comment: '碎石号', length: 20, nullable: true })
  swlNo: string;

  @Column({
    name: 'serial_number',
    comment: '流水号',
    length: 50,
    nullable: true,
  })
  serialNumber: string;

  @Column({
    name: 'analysis_count',
    comment: '分析次数',
    type: 'integer',
    nullable: true,
  })
  analysisCount: number;

  @Column({
    name: 'analysis_date',
    comment: '分析日期',
    type: 'date',
    nullable: true,
  })
  analysisDate: Date;

  @Column({
    name: 'height',
    comment: '身高(cm)',
    type: 'float',
    nullable: true,
  })
  height: number;

  @Column({
    name: 'weight',
    comment: '体重(kg)',
    type: 'float',
    nullable: true,
  })
  weight: number;

  @Column({
    name: 'bmi',
    comment: 'BMI',
    type: 'float',
    nullable: true,
  })
  bmi: number;

  @Column({
    name: 'stone_location',
    comment: '结石位置描述',
    length: 100,
    nullable: true,
  })
  stoneLocation: string;

  @Column({
    name: 'analysis_method',
    comment: '分析方法-字典near_analyse2',
    length: 30,
    nullable: true,
  })
  analysisMethod: string;

  // 结石成分
  @Column({
    name: 'component1',
    comment: '成分一-字典near_compose',
    length: 30,
    nullable: true,
  })
  component1: string;

  @Column({
    name: 'component1_percent',
    comment: '成分一占比(%)',
    type: 'float',
    nullable: true,
  })
  component1Percent: number;

  @Column({
    name: 'component2',
    comment: '成分二-字典near_compose',
    length: 30,
    nullable: true,
  })
  component2: string;

  @Column({
    name: 'component2_percent',
    comment: '成分二占比(%)',
    type: 'float',
    nullable: true,
  })
  component2Percent: number;

  @Column({
    name: 'component3',
    comment: '成分三-字典near_compose',
    length: 30,
    nullable: true,
  })
  component3: string;

  @Column({
    name: 'component3_percent',
    comment: '成分三占比(%)',
    type: 'float',
    nullable: true,
  })
  component3Percent: number;

  @Column({
    name: 'component4',
    comment: '成分四-字典near_compose',
    length: 30,
    nullable: true,
  })
  component4: string;

  @Column({
    name: 'component4_percent',
    comment: '成分四占比(%)',
    type: 'float',
    nullable: true,
  })
  component4Percent: number;

  @Column({ name: 'remark', comment: '备注', type: 'text', nullable: true })
  remark: string;

  @Column({ name: 'operator', comment: '登记人', length: 20, nullable: true })
  operator: string;

  @Column({
    name: 'org_id',
    type: 'uuid',
    nullable: true,
    comment: '所属机构ID',
  })
  orgId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // 关联字段（PC 端保留的运行时字段）
  name: string;
  gender: string;
}
