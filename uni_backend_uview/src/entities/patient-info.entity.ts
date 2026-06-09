import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 患者档案实体
 */
@Entity({
  name: 'tbus_patient_info',
  comment: '患者档案',
})
export class PatientInfoEntity extends BaseEntity {
  @Column({ name: 'patientNo', comment: '档案号', length: 20, nullable: false })
  patientNo: string;

  @Column({ name: 'name', comment: '姓名', length: 30, nullable: true })
  name: string;

  @Column({ name: 'idCard', comment: '身份证号', length: 18, nullable: true })
  idCard: string;

  @Column({ name: 'gender', comment: '性别 0-未知 1-男 2-女', default: 0 })
  gender: number;

  @Column({ name: 'birthDate', comment: '出生日期', nullable: true })
  birthDate: Date;

  @Column({ name: 'nativeProvince', comment: '籍贯省', length: 20, nullable: true })
  nativeProvince: string;

  @Column({ name: 'nativeCity', comment: '籍贯市', length: 20, nullable: true })
  nativeCity: string;

  @Column({ name: 'nativeDistrict', comment: '籍贯区', length: 20, nullable: true })
  nativeDistrict: string;

  @Column({ name: 'nativeAddress', comment: '籍贯详细地址', length: 100, nullable: true })
  nativeAddress: string;

  @Column({ name: 'currentProvince', comment: '现住址省', length: 20, nullable: true })
  currentProvince: string;

  @Column({ name: 'currentCity', comment: '现住址市', length: 20, nullable: true })
  currentCity: string;

  @Column({ name: 'currentDistrict', comment: '现住址区', length: 20, nullable: true })
  currentDistrict: string;

  @Column({ name: 'currentAddress', comment: '现住址详细地址', length: 100, nullable: true })
  currentAddress: string;

  @Column({ name: 'telephone', comment: '固定电话', length: 20, nullable: true })
  telephone: string;

  @Column({ name: 'mobile', comment: '手机号码', length: 20, nullable: true })
  mobile: string;

  @Column({ name: 'occupation', comment: '职业', length: 20, nullable: true })
  occupation: string;

  @Column({ name: 'lastVisit', comment: '最近就诊时间', nullable: true })
  lastVisit: Date;

  @Column({ name: 'registerDate', comment: '登记日期', nullable: false })
  registerDate: Date;

  @Column({ name: 'deletedAt', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;
}