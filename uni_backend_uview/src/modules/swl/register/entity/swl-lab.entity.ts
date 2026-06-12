import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/** SWL 检验结果明细 */
@Entity({ name: 'tswl_lab_result_detail', schema: 'swl' })
export class SwlLabResultDetail {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'swl_no', length: 20 }) swlNo: string;
  @Column({ name: 'serial_number', length: 50 }) serialNumber: string;
  @Column({ name: 'test_type_code', length: 20, nullable: true, comment: '检验类型编码' }) testTypeCode: string;
  @Column({ name: 'test_type_name', length: 50, nullable: true, comment: '检验类型名' }) testTypeName: string;
  @Column({ name: 'group_code', length: 20, nullable: true, comment: '检验分组编码' }) groupCode: string;
  @Column({ name: 'group_name', length: 50, nullable: true, comment: '检验分组名' }) groupName: string;
  @Column({ name: 'item_code', length: 20, nullable: true, comment: '检验项目编码' }) itemCode: string;
  @Column({ name: 'item_name', length: 100, nullable: true, comment: '检验项目名' }) itemName: string;
  @Column({ name: 'result_value', length: 50, nullable: true, comment: '检验结果值' }) resultValue: string;
  @Column({ name: 'qualitative_result', length: 10, nullable: true, comment: '定性结果' }) qualitativeResult: string;
  @Column({ length: 20, nullable: true, comment: '单位' }) unit: string;
  @Column({ name: 'test_time', type: 'timestamp', nullable: true, comment: '检查时间' }) testTime: Date;
  @Column({ name: 'result_flag', type: 'smallint', default: 0, comment: '结果标识 0-正常 1-异常' }) resultFlag: number;
  @Column({ length: 20, nullable: true, comment: '录入人' }) operator: string;
  @Column({ name: 'reference_range', length: 255, nullable: true, comment: '参考值' }) referenceRange: string;
  @Column({ name: 'reference_min', type: 'float', nullable: true }) referenceMin: number;
  @Column({ name: 'reference_max', type: 'float', nullable: true }) referenceMax: number;
  @Column({ name: 'report_no', length: 50, nullable: true, comment: '报告单号' }) reportNo: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true }) orgId: string;
  @Column({ type: 'int', nullable: true, comment: '检验次数/序号' }) seq: number;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt: Date;
}
