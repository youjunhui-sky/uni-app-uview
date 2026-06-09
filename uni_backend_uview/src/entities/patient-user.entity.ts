import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 就诊人关联实体
 */
@Entity({
  name: 'tpatient_user',
  comment: '就诊人关联',
})
export class PatientUserEntity extends BaseEntity {
  @Column({ name: 'patientNo', comment: '档案号', length: 20, nullable: false })
  patientNo: string;

  @Column({ name: 'userId', comment: '用户ID', nullable: false })
  userId: number;

  @Column({ name: 'default', comment: '是否默认 0-否 1-是', default: 0 })
  default: number;

  @Column({ name: 'tenantId', comment: '租户ID', nullable: true })
  tenantId: number;
}