import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 代谢评估内容表
 */
@Entity({
  name: 'tetiology_mua_content',
  comment: '代谢评估内容表',
})
export class MuaContentEntity extends BaseEntity {
  @Column({ name: 'patientNo', comment: '档案号', length: 20, nullable: false })
  patientNo: string;

  @Column({ name: 'swlNo', comment: '碎石号', length: 20, nullable: true })
  swlNo: string;

  @Column({ name: 'serialNumber', comment: '流水号', length: 50, nullable: true })
  serialNumber: string;

  @Column({ name: 'assessmentCount', comment: '评估次数', type: 'int', nullable: true })
  assessmentCount: number;

  @Column({ name: 'assessmentType', comment: '评估类型', length: 10, nullable: true })
  assessmentType: string;

  @Column({ name: 'assessmentResult', comment: '评估结果', type: 'text', nullable: true })
  assessmentResult: string;

  @Column({ name: 'treatmentSuggestion', comment: '诊疗建议', type: 'text', nullable: true })
  treatmentSuggestion: string;

  @Column({ name: 'guideSuggestion', comment: '治疗防治建议', type: 'text', nullable: true })
  guideSuggestion: string;

  @Column({ name: 'aiGuideSuggestion', comment: 'AI治疗防治建议', type: 'text', nullable: true })
  aiGuideSuggestion: string;

  @Column({ name: 'doctor', comment: '评估医生', length: 20, nullable: true })
  doctor: string;

  @Column({ name: 'operator', comment: '填表人', length: 20, nullable: true })
  operator: string;

  @Column({ name: 'jbjx', comment: '疾病检查结果', type: 'text', nullable: true })
  jbjx: string;
}