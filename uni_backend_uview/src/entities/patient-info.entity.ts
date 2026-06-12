import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 患者档案实体（对齐 mdp 库 base.tbus_patient_info）
 * 注：mdp 中 PK 改为 uuid，类型与原 int 完全不同
 */
@Entity({
  name: 'tbus_patient_info',
  schema: 'base',
  comment: '患者档案',
})
export class PatientInfoEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '主键' })
  id: string;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  // 注：mdp 库 base.tbus_patient_info 实际 DDL 不含 org_id（已与 mdp-ddl.txt 对齐），
  // 保留会触发 INSERT 失败：column PatientInfoEntity.org_id does not exist
  @Column({ name: 'patient_no', comment: '档案号', length: 20 })
  patientNo: string;

  @Column({ comment: '姓名', length: 30, nullable: true })
  name: string;

  @Column({ name: 'id_card', comment: '身份证号', length: 18, nullable: true })
  idCard: string;

  @Column({ comment: '性别 0-未知 1-男 2-女', type: 'smallint', default: 0, nullable: true })
  gender: number;

  @Column({ name: 'birth_date', comment: '出生日期', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'native_province', comment: '籍贯省', length: 20, nullable: true })
  nativeProvince: string;

  @Column({ name: 'native_city', comment: '籍贯市', length: 20, nullable: true })
  nativeCity: string;

  @Column({ name: 'native_district', comment: '籍贯区', length: 20, nullable: true })
  nativeDistrict: string;

  @Column({ name: 'native_address', comment: '籍贯详细地址', length: 100, nullable: true })
  nativeAddress: string;

  /** mdp 新增列 */
  @Column({ name: 'zip_code', comment: '邮编', length: 6, nullable: true })
  zipCode: string;

  @Column({ name: 'current_province', comment: '现住址省', length: 20, nullable: true })
  currentProvince: string;

  @Column({ name: 'current_city', comment: '现住址市', length: 20, nullable: true })
  currentCity: string;

  @Column({ name: 'current_district', comment: '现住址区', length: 20, nullable: true })
  currentDistrict: string;

  @Column({ name: 'current_address', comment: '现住址详细地址', length: 100, nullable: true })
  currentAddress: string;

  @Column({ comment: '固定电话', length: 20, nullable: true })
  telephone: string;

  @Column({ comment: '手机号码', length: 20, nullable: true })
  mobile: string;

  @Column({ comment: '职业', length: 20, nullable: true })
  occupation: string;

  @Column({ name: 'last_visit', comment: '最近就诊时间', type: 'timestamp', nullable: true })
  lastVisit: Date;

  @Column({ name: 'register_date', comment: '登记日期', type: 'date' })
  registerDate: Date;

  @Column({ name: 'deleted_at', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;

  /** mdp 新增列 */
  @Column({ name: 'id_type', comment: '证件类型', length: 10, nullable: true })
  idType: string;
}
