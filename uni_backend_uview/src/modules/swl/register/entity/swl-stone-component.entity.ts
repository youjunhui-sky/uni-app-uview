import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 结石成分分析 */
@Entity({ name: 'tswl_stone_component', schema: 'swl' })
export class SwlStoneComponent {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'patient_no', length: 20 }) patientNo: string;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'analysis_count', type: 'int', nullable: true, comment: '分析次数' }) analysisCount: number;
  @Column({ name: 'analysis_date', type: 'date', nullable: true, comment: '分析日期' }) analysisDate: Date;
  @Column({ type: 'float', nullable: true, comment: '身高' }) height: number;
  @Column({ type: 'float', nullable: true, comment: '体重' }) weight: number;
  @Column({ type: 'float', nullable: true, comment: 'BMI' }) bmi: number;
  @Column({ name: 'stone_location', length: 50, nullable: true, comment: '结石部位' }) stoneLocation: string;
  @Column({ name: 'analysis_method', length: 50, nullable: true, comment: '分析方法' }) analysisMethod: string;
  @Column({ length: 30, nullable: true, comment: '成分一' }) component1: string;
  @Column({ name: 'component1_percent', type: 'float', nullable: true, comment: '成分一百分比' }) component1Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分二' }) component2: string;
  @Column({ name: 'component2_percent', type: 'float', nullable: true }) component2Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分三' }) component3: string;
  @Column({ name: 'component3_percent', type: 'float', nullable: true }) component3Percent: number;
  @Column({ length: 30, nullable: true, comment: '成分四' }) component4: string;
  @Column({ name: 'component4_percent', type: 'float', nullable: true }) component4Percent: number;
  @Column({ type: 'text', nullable: true, comment: '备注' }) remark: string;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
