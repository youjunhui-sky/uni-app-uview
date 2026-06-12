import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * SWL 治疗记录实体
 * 对应表 swl.tswl_treatment_record
 */
@Entity({ name: 'tswl_treatment_record', schema: 'swl' })
export class SwlTreatment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'swl_no', length: 20, comment: '碎石号' })
  swlNo: string;

  @Column({ name: 'serial_number', length: 50, comment: '流水号' })
  serialNumber: string;

  @Column({ name: 'sequence_no', type: 'int', comment: '序列号' })
  sequenceNo: number;

  @Column({ type: 'int', comment: '治疗期数' })
  episode: number;

  @Column({ name: 'preop_diagnosis', type: 'text', nullable: true, comment: '术前诊断' })
  preopDiagnosis: string;

  @Column({ length: 10, nullable: true, comment: '部位一位置(左/右)' })
  position1: string;

  @Column({ length: 20, nullable: true, comment: '部位一具体位置' })
  location1: string;

  @Column({ length: 20, nullable: true, comment: '治疗深度(cm)' })
  depth1: string;

  @Column({ name: 'stone_size_front1', type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '结石长径(mm)' })
  stoneSizeFront1: number;

  @Column({ name: 'stone_size_back1', type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '结石宽径(mm)' })
  stoneSizeBack1: number;

  @Column({ name: 'stone_area1', type: 'decimal', precision: 8, scale: 2, nullable: true, comment: '结石表面积(mm²)' })
  stoneArea1: number;

  @Column({ length: 10, nullable: true, comment: '部位二位置(左/右)' })
  position2: string;

  @Column({ length: 50, nullable: true, comment: '部位二具体位置' })
  location2: string;

  @Column({ length: 20, nullable: true, comment: '治疗深度(cm)' })
  depth2: string;

  @Column({ name: 'stone_size_front2', type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '结石长径(mm)' })
  stoneSizeFront2: number;

  @Column({ name: 'stone_size_back2', type: 'decimal', precision: 5, scale: 2, nullable: true, comment: '结石宽径(mm)' })
  stoneSizeBack2: number;

  @Column({ name: 'stone_area2', type: 'decimal', precision: 8, scale: 2, nullable: true, comment: '结石表面积(mm²)' })
  stoneArea2: number;

  @Column({ name: 'stone_count', type: 'integer', nullable: true, comment: '受治疗结石数目' })
  stoneCount: number;

  @Column({ name: 'preop_therapy', length: 100, nullable: true, comment: '术前辅助治疗' })
  preopTherapy: string;

  @Column({ name: 'preop_preparation', length: 100, nullable: true, comment: '术前准备措施' })
  preopPreparation: string;

  @Column({ name: 'stent_type', length: 20, nullable: true, comment: '支架管类型' })
  stentType: string;

  @Column({ length: 30, nullable: true, comment: '主要机型' })
  machine1: string;

  @Column({ length: 30, nullable: true, comment: '辅助机型' })
  machine2: string;

  @Column({ name: 'body_position', length: 20, nullable: true, comment: '治疗体位' })
  bodyPosition: string;

  @Column({ name: 'targeting_method', length: 20, nullable: true, comment: '定位方式' })
  targetingMethod: string;

  @Column({ length: 20, nullable: true, comment: '治疗电压(kV)' })
  voltage: string;

  @Column({ name: 'shockwave_count', length: 20, nullable: true, comment: '冲击次数' })
  shockwaveCount: string;

  @Column({ name: 'fluoroscopy_kv', length: 20, nullable: true, comment: '透视KV值' })
  fluoroscopyKV: string;

  @Column({ name: 'pulse_rate', length: 20, nullable: true, comment: '脉冲频率(次/分)' })
  pulseRate: string;

  @Column({ name: 'stone_response', length: 50, nullable: true, comment: '结石反应' })
  stoneResponse: string;

  @Column({ name: 'ma_value', length: 20, nullable: true, comment: 'MA值' })
  maValue: string;

  @Column({ name: 'no_adverse_reaction', type: 'smallint', default: 0, nullable: true, comment: '无不良反应' })
  noAdverseReaction: number;

  @Column({ name: 'has_skin_bleeding', type: 'smallint', default: 0, nullable: true, comment: '皮肤渗血/瘀斑' })
  hasSkinBleeding: number;

  @Column({ name: 'has_nausea', type: 'smallint', default: 0, nullable: true, comment: '恶心呕吐' })
  hasNausea: number;

  @Column({ name: 'has_radiation_pain', type: 'smallint', default: 0, nullable: true, comment: '放射痛' })
  hasRadiationPain: number;

  @Column({ name: 'other_adverse_reaction', type: 'smallint', default: 0, nullable: true, comment: '其他不良反应' })
  otherAdverseReaction: number;

  @Column({ name: 'pain_score', length: 20, nullable: true, comment: '疼痛指数' })
  painScore: string;

  @Column({ name: 'preop_images', type: 'text', nullable: true, comment: '术前影像路径' })
  preopImages: string;

  @Column({ name: 'postop_images', type: 'text', nullable: true, comment: '术后影像路径' })
  postopImages: string;

  @Column({ name: 'intraop_management', type: 'text', nullable: true, comment: '术中处理措施' })
  intraopManagement: string;

  @Column({ length: 20, nullable: true, comment: '主治医生' })
  doctor: string;

  @Column({ name: 'treatment_cost', type: 'decimal', precision: 10, scale: 2, nullable: true, comment: '治疗费用' })
  treatmentCost: number;

  @Column({ name: 'treatment_time', type: 'date', nullable: true, comment: '治疗开始时间' })
  treatmentTime: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '所属机构ID' })
  orgId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', comment: '更新时间' })
  updatedAt: Date;
}
