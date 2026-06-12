import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * SWL 影像检查报告实体
 * 对应表 swl.timg_exam_report
 */
@Entity({ name: 'timg_exam_report', schema: 'swl' })
export class SwlImagingExam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'swl_no', length: 20, comment: '碎石号' })
  swlNo: string;

  @Column({ name: 'serial_number', length: 30, comment: '流水号' })
  serialNumber: string;

  @Column({ name: 'has_ultrasound', type: 'smallint', nullable: true, comment: '是否超声 0-否 1-是' })
  hasUltrasound: number;

  @Column({ name: 'has_kub', type: 'smallint', nullable: true, comment: '是否KUB 0-否 1-是' })
  hasKUB: number;

  @Column({ name: 'has_ivu', type: 'smallint', nullable: true, comment: '是否IVU 0-否 1-是' })
  hasIVU: number;

  @Column({ name: 'has_ct', type: 'smallint', nullable: true, comment: '是否CT 0-否 1-是' })
  hasCT: number;

  @Column({ name: 'has_mri', type: 'smallint', nullable: true, comment: '是否MRI 0-否 1-是' })
  hasMRI: number;

  @Column({ name: 'hasctu', type: 'smallint', nullable: true, comment: '是否CTU 0-否 1-是' })
  hasCTU: number;

  @Column({ name: 'ct_value', type: 'float', nullable: true, comment: 'CT值' })
  ctValue: number;

  // ====== 左肾 ======
  @Column({ name: 'left_kidney_stone_count', length: 20, nullable: true, comment: '左肾结石数量' })
  leftKidneyStoneCount: string;
  @Column({ name: 'left_kidney_stone1_front', type: 'float', nullable: true, comment: '左肾第1颗长径(mm)' })
  leftKidneyStone1Front: number;
  @Column({ name: 'left_kidney_stone1_back', type: 'float', nullable: true, comment: '左肾第1颗宽径(mm)' })
  leftKidneyStone1Back: number;
  @Column({ name: 'left_kidney_stone1_area', type: 'float', nullable: true, comment: '左肾第1颗表面积(mm²)' })
  leftKidneyStone1Area: number;
  @Column({ name: 'left_kidney_stone1_location', length: 20, nullable: true, comment: '左肾第1颗位置' })
  leftKidneyStone1Location: string;
  @Column({ name: 'left_kidney_stone2_front', type: 'float', nullable: true })
  leftKidneyStone2Front: number;
  @Column({ name: 'left_kidney_stone2_back', type: 'float', nullable: true })
  leftKidneyStone2Back: number;
  @Column({ name: 'left_kidney_stone2_area', type: 'float', nullable: true })
  leftKidneyStone2Area: number;
  @Column({ name: 'left_kidney_stone2_location', length: 20, nullable: true })
  leftKidneyStone2Location: string;
  @Column({ name: 'left_kidney_stone_shape', length: 20, nullable: true, comment: '左肾结石形状' })
  leftKidneyStoneShape: string;
  @Column({ name: 'left_kidney_stone_nature', length: 20, nullable: true, comment: '左肾结石性质' })
  leftKidneyStoneNature: string;
  @Column({ name: 'left_kidney_mild_hydronephrosis', type: 'smallint', default: 0, comment: '左肾轻度积水' })
  leftKidneyMildHydronephrosis: number;
  @Column({ name: 'left_kidney_moderate_hydronephrosis', type: 'smallint', default: 0, comment: '左肾中度积水' })
  leftKidneyModerateHydronephrosis: number;
  @Column({ name: 'left_kidney_dysfunction', type: 'smallint', default: 0, comment: '左肾肾功能损害' })
  leftKidneyDysfunction: number;
  @Column({ name: 'left_kidney_calyeal_dilation', type: 'smallint', default: 0, comment: '左肾肾小盏扩张' })
  leftKidneyCalycealDilation: number;
  @Column({ name: 'left_kidney_severe_hydronephrosis', type: 'smallint', default: 0, comment: '左肾重度积水' })
  leftKidneySevereHydronephrosis: number;
  @Column({ name: 'left_kidney_major_calyx_dilation', type: 'smallint', default: 0, comment: '左肾肾大盏扩张' })
  leftKidneyMajorCalyxDilation: number;
  @Column({ name: 'left_kidney_atrophy', type: 'smallint', default: 0, comment: '左肾肾萎缩' })
  leftKidneyAtrophy: number;

  // ====== 右肾 ======
  @Column({ name: 'right_kidney_stone_count', length: 20, nullable: true })
  rightKidneyStoneCount: string;
  @Column({ name: 'right_kidney_stone1_front', type: 'float', nullable: true })
  rightKidneyStone1Front: number;
  @Column({ name: 'right_kidney_stone1_back', type: 'float', nullable: true })
  rightKidneyStone1Back: number;
  @Column({ name: 'right_kidney_stone1_area', type: 'float', nullable: true })
  rightKidneyStone1Area: number;
  @Column({ name: 'right_kidney_stone1_location', length: 20, nullable: true })
  rightKidneyStone1Location: string;
  @Column({ name: 'right_kidney_stone2_front', type: 'float', nullable: true })
  rightKidneyStone2Front: number;
  @Column({ name: 'right_kidney_stone2_back', type: 'float', nullable: true })
  rightKidneyStone2Back: number;
  @Column({ name: 'right_kidney_stone2_area', type: 'float', nullable: true })
  rightKidneyStone2Area: number;
  @Column({ name: 'right_kidney_stone2_location', length: 20, nullable: true })
  rightKidneyStone2Location: string;
  @Column({ name: 'right_kidney_stone_shape', length: 20, nullable: true })
  rightKidneyStoneShape: string;
  @Column({ name: 'right_kidney_stone_nature', length: 20, nullable: true })
  rightKidneyStoneNature: string;
  @Column({ name: 'right_kidney_mild_hydronephrosis', type: 'smallint', default: 0 })
  rightKidneyMildHydronephrosis: number;
  @Column({ name: 'right_kidney_moderate_hydronephrosis', type: 'smallint', default: 0 })
  rightKidneyModerateHydronephrosis: number;
  @Column({ name: 'right_kidney_dysfunction', type: 'smallint', default: 0 })
  rightKidneyDysfunction: number;
  @Column({ name: 'right_kidney_calyeal_dilation', type: 'smallint', default: 0 })
  rightKidneyCalycealDilation: number;
  @Column({ name: 'right_kidney_severe_hydronephrosis', type: 'smallint', default: 0 })
  rightKidneySevereHydronephrosis: number;
  @Column({ name: 'right_kidney_major_calyx_dilation', type: 'smallint', default: 0 })
  rightKidneyMajorCalyxDilation: number;
  @Column({ name: 'right_kidney_atrophy', type: 'smallint', default: 0 })
  rightKidneyAtrophy: number;

  // ====== 左输尿管 ======
  @Column({ name: 'left_ureter_stone_count', length: 20, nullable: true })
  leftUreterStoneCount: string;
  @Column({ name: 'left_ureter_stone1_front', type: 'float', nullable: true })
  leftUreterStone1Front: number;
  @Column({ name: 'left_ureter_stone1_back', type: 'float', nullable: true })
  leftUreterStone1Back: number;
  @Column({ name: 'left_ureter_stone1_area', type: 'float', nullable: true })
  leftUreterStone1Area: number;
  @Column({ name: 'left_ureter_stone1_location', length: 20, nullable: true })
  leftUreterStone1Location: string;
  @Column({ name: 'left_ureter_stone2_front', type: 'float', nullable: true })
  leftUreterStone2Front: number;
  @Column({ name: 'left_ureter_stone2_back', type: 'float', nullable: true })
  leftUreterStone2Back: number;
  @Column({ name: 'left_ureter_stone2_area', type: 'float', nullable: true })
  leftUreterStone2Area: number;
  @Column({ name: 'left_ureter_stone2_location', length: 20, nullable: true })
  leftUreterStone2Location: string;
  @Column({ name: 'left_ureter_stone_shape', length: 20, nullable: true })
  leftUreterStoneShape: string;
  @Column({ name: 'left_ureter_stone_nature', length: 20, nullable: true })
  leftUreterStoneNature: string;
  @Column({ name: 'left_ureter_mild_hydronephrosis', type: 'smallint', default: 0 })
  leftUreterMildHydronephrosis: number;
  @Column({ name: 'left_ureter_moderate_hydronephrosis', type: 'smallint', default: 0 })
  leftUreterModerateHydronephrosis: number;
  @Column({ name: 'left_ureter_dysfunction', type: 'smallint', default: 0 })
  leftUreterDysfunction: number;
  @Column({ name: 'left_ureter_severe_hydronephrosis', type: 'smallint', default: 0 })
  leftUreterSevereHydronephrosis: number;
  @Column({ name: 'left_ureter_atrophy', type: 'smallint', default: 0 })
  leftUreterAtrophy: number;

  // ====== 右输尿管 ======
  @Column({ name: 'right_ureter_stone_count', length: 20, nullable: true })
  rightUreterStoneCount: string;
  @Column({ name: 'right_ureter_stone1_front', type: 'float', nullable: true })
  rightUreterStone1Front: number;
  @Column({ name: 'right_ureter_stone1_back', type: 'float', nullable: true })
  rightUreterStone1Back: number;
  @Column({ name: 'right_ureter_stone1_area', type: 'float', nullable: true })
  rightUreterStone1Area: number;
  @Column({ name: 'right_ureter_stone1_location', length: 20, nullable: true })
  rightUreterStone1Location: string;
  @Column({ name: 'right_ureter_stone2_front', type: 'float', nullable: true })
  rightUreterStone2Front: number;
  @Column({ name: 'right_ureter_stone2_back', type: 'float', nullable: true })
  rightUreterStone2Back: number;
  @Column({ name: 'right_ureter_stone2_area', type: 'float', nullable: true })
  rightUreterStone2Area: number;
  @Column({ name: 'right_ureter_stone2_location', length: 20, nullable: true })
  rightUreterStone2Location: string;
  @Column({ name: 'right_ureter_stone_shape', length: 20, nullable: true })
  rightUreterStoneShape: string;
  @Column({ name: 'right_ureter_stone_nature', length: 20, nullable: true })
  rightUreterStoneNature: string;
  @Column({ name: 'right_ureter_mild_hydronephrosis', type: 'smallint', default: 0 })
  rightUreterMildHydronephrosis: number;
  @Column({ name: 'right_ureter_moderate_hydronephrosis', type: 'smallint', default: 0 })
  rightUreterModerateHydronephrosis: number;
  @Column({ name: 'right_ureter_dysfunction', type: 'smallint', default: 0 })
  rightUreterDysfunction: number;
  @Column({ name: 'right_ureter_severe_hydronephrosis', type: 'smallint', default: 0 })
  rightUreterSevereHydronephrosis: number;
  @Column({ name: 'right_ureter_atrophy', type: 'smallint', default: 0 })
  rightUreterAtrophy: number;

  // ====== 膀胱 ======
  @Column({ name: 'bladder_stone_count', length: 20, nullable: true })
  bladderStoneCount: string;
  @Column({ name: 'bladder_stone1_front', type: 'float', nullable: true })
  bladderStone1Front: number;
  @Column({ name: 'bladder_stone1_back', type: 'float', nullable: true })
  bladderStone1Back: number;
  @Column({ name: 'bladder_stone1_area', type: 'float', nullable: true })
  bladderStone1Area: number;
  @Column({ name: 'bladder_stone1_location', length: 50, nullable: true })
  bladderStone1Location: string;
  @Column({ name: 'bladder_stone2_front', type: 'float', nullable: true })
  bladderStone2Front: number;
  @Column({ name: 'bladder_stone2_back', type: 'float', nullable: true })
  bladderStone2Back: number;
  @Column({ name: 'bladder_stone2_area', type: 'float', nullable: true })
  bladderStone2Area: number;
  @Column({ name: 'bladder_stone2_location', length: 50, nullable: true })
  bladderStone2Location: string;
  @Column({ name: 'bladder_stone_shape', length: 20, nullable: true })
  bladderStoneShape: string;
  @Column({ name: 'bladder_stone_nature', length: 20, nullable: true })
  bladderStoneNature: string;
  @Column({ name: 'bladder_urinary_retention', type: 'smallint', default: 0, comment: '膀胱尿潴留' })
  bladderUrinaryRetention: number;
  @Column({ name: 'bladder_inflammation', type: 'smallint', default: 0, comment: '膀胱炎症' })
  bladderInflammation: number;
  @Column({ name: 'bladder_irritation', type: 'smallint', default: 0, comment: '膀胱刺激症状' })
  bladderIrritation: number;
  @Column({ name: 'bladder_obstruction', type: 'smallint', default: 0, comment: '膀胱梗阻' })
  bladderObstruction: number;
  @Column({ name: 'bladder_painful', type: 'smallint', default: 0, comment: '膀胱尿急尿痛' })
  bladderPainful: number;

  // ====== 尿道 ======
  @Column({ name: 'urethra_stone_count', length: 20, nullable: true })
  urethraStoneCount: string;
  @Column({ name: 'urethra_stone1_front', type: 'float', nullable: true })
  urethraStone1Front: number;
  @Column({ name: 'urethra_stone1_back', type: 'float', nullable: true })
  urethraStone1Back: number;
  @Column({ name: 'urethra_stone1_area', type: 'float', nullable: true })
  urethraStone1Area: number;
  @Column({ name: 'urethra_stone1_location', length: 50, nullable: true })
  urethraStone1Location: string;
  @Column({ name: 'urethra_stone2_front', type: 'float', nullable: true })
  urethraStone2Front: number;
  @Column({ name: 'urethra_stone2_back', type: 'float', nullable: true })
  urethraStone2Back: number;
  @Column({ name: 'urethra_stone2_area', type: 'float', nullable: true })
  urethraStone2Area: number;
  @Column({ name: 'urethra_stone2_location', length: 50, nullable: true })
  urethraStone2Location: string;
  @Column({ name: 'urethra_stone_shape', length: 20, nullable: true })
  urethraStoneShape: string;
  @Column({ name: 'urethra_stone_nature', length: 20, nullable: true })
  urethraStoneNature: string;
  @Column({ name: 'urethra_urinary_retention', type: 'smallint', default: 0, comment: '尿道尿潴留' })
  urethraUrinaryRetention: number;
  @Column({ name: 'urethra_mild_hydronephrosis', type: 'smallint', default: 0 })
  urethraMildHydronephrosis: number;
  @Column({ name: 'urethra_moderate_hydronephrosis', type: 'smallint', default: 0 })
  urethraModerateHydronephrosis: number;
  @Column({ name: 'urethra_severe_hydronephrosis', type: 'smallint', default: 0 })
  urethraSevereHydronephrosis: number;
  @Column({ name: 'urethra_painful', type: 'smallint', default: 0, comment: '尿道尿急尿痛' })
  urethraPainful: number;

  // ====== 并发症 ======
  @Column({ name: 'complication_polycystic_kidney', type: 'smallint', default: 0, comment: '多囊肾' })
  complicationPolycysticKidney: number;
  @Column({ name: 'complication_duplex_kidney', type: 'smallint', default: 0, comment: '重复肾' })
  complicationDuplexKidney: number;
  @Column({ name: 'complication_horseshoe_kidney', type: 'smallint', default: 0, comment: '马蹄肾' })
  complicationHorseshoeKidney: number;
  @Column({ name: 'complication_ureteral_stricture', type: 'smallint', default: 0, comment: '输尿管狭窄' })
  complicationUreteralStricture: number;
  @Column({ name: 'complication_urethral_stricture', type: 'smallint', default: 0, comment: '尿道狭窄' })
  complicationUrethralStricture: number;
  @Column({ name: 'complication_bladder_diverticulum', type: 'smallint', default: 0, comment: '膀胱憩室' })
  complicationBladderDiverticulum: number;
  @Column({ name: 'complication_medullary_sponge_kidney', type: 'smallint', default: 0, comment: '海绵肾' })
  complicationMedullarySpongeKidney: number;
  @Column({ name: 'complication_renal_cyst', type: 'smallint', default: 0, comment: '肾囊肿' })
  complicationRenalCyst: number;
  @Column({ name: 'complication_ectopic_kidney', type: 'smallint', default: 0, comment: '异位肾' })
  complicationEctopicKidney: number;
  @Column({ name: 'complication_neurogenic_bladder', type: 'smallint', default: 0, comment: '神经源性膀胱' })
  complicationNeurogenicBladder: number;
  @Column({ name: 'complication_ureterocele', type: 'smallint', default: 0, comment: '输尿管囊肿' })
  complicationUreterocele: number;
  @Column({ name: 'complication_urethral_foreign_body', type: 'smallint', default: 0, comment: '尿道异物' })
  complicationUrethralForeignBody: number;
  @Column({ name: 'complication_renal_diverticulum', type: 'smallint', default: 0, comment: '肾脏憩室' })
  complicationRenalDiverticulum: number;
  @Column({ name: 'complication_upj_stricture', type: 'smallint', default: 0, comment: 'UPJ狭窄' })
  complicationUPJStricture: number;
  @Column({ name: 'complication_bph', type: 'smallint', default: 0, comment: 'BPH' })
  complicationBPH: number;
  @Column({ name: 'complication_urethral_diverticulum', type: 'smallint', default: 0, comment: '尿道憩室' })
  complicationUrethralDiverticulum: number;
  @Column({ name: 'has_other_complications', type: 'smallint', default: 0, comment: '其他并发症' })
  hasOtherComplications: number;
  @Column({ name: 'other_complications_desc', type: 'text', nullable: true, comment: '其他并发症描述' })
  otherComplicationsDesc: string;

  @Column({ name: 'registrar', length: 20, nullable: true, comment: '登记人' })
  registrar: string;
  @Column({ name: 'register_time', type: 'date', nullable: true, comment: '登记时间' })
  registerTime: Date;
  @Column({ name: 'image_urls', type: 'text', nullable: true, comment: '影像地址' })
  imageUrls: string;
  @Column({ name: 'org_id', type: 'uuid', nullable: true })
  orgId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
