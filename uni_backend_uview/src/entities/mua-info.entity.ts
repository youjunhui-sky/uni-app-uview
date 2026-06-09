import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 代谢评估信息表
 */
@Entity({
  name: 'tetiology_mua_info',
  comment: '代谢评估信息表',
})
export class MuaInfoEntity extends BaseEntity {
  @Column({ name: 'patientNo', comment: '档案号', length: 20, nullable: false })
  patientNo: string;

  @Column({ name: 'swlNo', comment: '碎石号', length: 20, nullable: true })
  swlNo: string;

  @Column({ name: 'serialNumber', comment: '流水号', length: 50, nullable: true })
  serialNumber: string;

  @Column({ name: 'assessmentCount', comment: '评估次数', type: 'int', nullable: true })
  assessmentCount: number;

  @Column({ name: 'outpatientNo', comment: '门诊号', length: 20, nullable: true })
  outpatientNo: string;

  @Column({ name: 'inpatientNo', comment: '住院号', length: 20, nullable: true })
  inpatientNo: string;

  @Column({ name: 'bedNo', comment: '病床号', length: 20, nullable: true })
  bedNo: string;

  @Column({ name: 'department', comment: '就诊科室', length: 30, nullable: true })
  department: string;

  @Column({ name: 'age', comment: '年龄', length: 10, nullable: true })
  age: string;

  @Column({ name: 'assessmentDate', comment: '评估日期', type: 'date', nullable: true })
  assessmentDate: Date;

  @Column({ name: 'height', comment: '身高(cm)', type: 'float', nullable: true })
  height: number;

  @Column({ name: 'weight', comment: '体重(kg)', type: 'float', nullable: true })
  weight: number;

  @Column({ name: 'bmi', comment: 'BMI指数', type: 'float', nullable: true })
  bmi: number;

  @Column({ name: 'stoneHistory', comment: '结石病史', type: 'text', nullable: true })
  stoneHistory: string;

  @Column({ name: 'familyHistory', comment: '家族史', type: 'text', nullable: true })
  familyHistory: string;

  @Column({ name: 'otherHistory', comment: '其他病史', type: 'text', nullable: true })
  otherHistory: string;

  @Column({ name: 'hasUltrasound', comment: '是否超声', type: 'smallint', nullable: true })
  hasUltrasound: number;

  @Column({ name: 'hasKUB', comment: '是否KUB', type: 'smallint', nullable: true })
  hasKUB: number;

  @Column({ name: 'hasCT', comment: '是否CT', type: 'smallint', nullable: true })
  hasCT: number;

  @Column({ name: 'hasMRI', comment: '是否MRI', type: 'smallint', nullable: true })
  hasMRI: number;

  @Column({ name: 'hasCTU', comment: '是否CTU', type: 'smallint', nullable: true })
  hasCTU: number;

  @Column({ name: 'hasIVU', comment: '是否IVU', type: 'smallint', nullable: true })
  hasIVU: number;

  @Column({ name: 'imageDiagnosis', comment: '影像诊断', type: 'text', nullable: true })
  imageDiagnosis: string;

  @Column({ name: 'anatomicalAbnormal', comment: '解剖异常', length: 50, nullable: true })
  anatomicalAbnormal: string;

  @Column({ name: 'doctor', comment: '评估医生', length: 20, nullable: true })
  doctor: string;

  @Column({ name: 'operator', comment: '填表人', length: 20, nullable: true })
  operator: string;

  @Column({ name: 'ctValue', comment: 'CT值', type: 'float', nullable: true })
  ctValue: number;

  @Column({ name: 'kub', comment: 'KUB', length: 50, nullable: true })
  kub: string;

  @Column({ name: 'stoneComp', comment: '结石成分', length: 50, nullable: true })
  stoneComp: string;

  @Column({ name: 'otherStoneComp', comment: '其他结石成分', length: 200, nullable: true })
  otherStoneComp: string;

  @Column({ name: 'component1', comment: '成分一', length: 30, nullable: true })
  component1: string;

  @Column({ name: 'component1Percent', comment: '成分一占比', type: 'float', nullable: true })
  component1Percent: number;

  @Column({ name: 'component2', comment: '成分二', length: 30, nullable: true })
  component2: string;

  @Column({ name: 'component2Percent', comment: '成分二占比', type: 'float', nullable: true })
  component2Percent: number;

  @Column({ name: 'component3', comment: '成分三', length: 30, nullable: true })
  component3: string;

  @Column({ name: 'component3Percent', comment: '成分三占比', type: 'float', nullable: true })
  component3Percent: number;

  @Column({ name: 'component4', comment: '成分四', length: 30, nullable: true })
  component4: string;

  @Column({ name: 'component4Percent', comment: '成分四占比', type: 'float', nullable: true })
  component4Percent: number;

  @Column({ name: 'stoneLocation', comment: '结石位置描述', length: 50, nullable: true })
  stoneLocation: string;

  @Column({ name: 'analysisMethod', comment: '分析方法', length: 30, nullable: true })
  analysisMethod: string;

  @Column({ name: 'analysisDate', comment: '分析日期', type: 'date', nullable: true })
  analysisDate: Date;

  @Column({ name: 'deletedAt', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ name: 'assessmentType', comment: '评估类型', length: 20, nullable: true })
  assessmentType: string;

  @Column({ name: 'tenantId', comment: '租户ID', type: 'int', nullable: true })
  tenantId: number;
}