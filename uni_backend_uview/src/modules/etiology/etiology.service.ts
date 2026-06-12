import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuaInfoEntity } from '../../entities/mua-info.entity';
import { MuaContentEntity } from '../../entities/mua-content.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { BizException } from '../../common/exceptions';

@Injectable()
export class EtiologyService {
  constructor(
    @InjectRepository(MuaInfoEntity)
    private readonly muaInfoEntity: Repository<MuaInfoEntity>,
    @InjectRepository(MuaContentEntity)
    private readonly muaContentEntity: Repository<MuaContentEntity>,
    @InjectRepository(PatientUserEntity)
    private readonly patientUserEntity: Repository<PatientUserEntity>,
  ) {}

  /**
   * 越权防御：校验 patientNo 归属当前 userId
   * 与 getAnswer 行为一致
   */
  private async assertPatientOwned(patientNo: string, requestUserId: number | undefined): Promise<void> {
    if (!requestUserId) {
      // 没拿到 jwt 上下文，理论上 controller 已被 JwtAuthGuard 拦住，这里只是兜底
      return;
    }
    const owned = await this.patientUserEntity.findOne({
      where: { userId: requestUserId, patientNo },
    });
    if (!owned) {
      throw new BizException('该档案不在当前用户下，无权查看');
    }
  }

  /**
   * 根据档案号查询代谢评估信息
   */
  async getMuaInfoByPatientNo(patientNo: string, requestUserId?: number): Promise<any[]> {
    if (!patientNo) {
      throw new BizException('patientNo 不能为空');
    }
    await this.assertPatientOwned(patientNo, requestUserId);

    const queryBuilder = this.muaInfoEntity
      .createQueryBuilder('a')
      .select([
        'a.id AS "id"',
        'a.patient_no AS "patientNo"',
        'a.mua_no AS "swlNo"',
        'a.serial_number AS "serialNumber"',
        'a.assessment_count AS "assessmentCount"',
        'a.outpatient_no AS "outpatientNo"',
        'a.inpatient_no AS "inpatientNo"',
        'a.bed_no AS "bedNo"',
        'a.department AS "department"',
        'a.assessment_date AS "assessmentDate"',
        'a.age AS "age"',
        'a.height AS "height"',
        'a.weight AS "weight"',
        'a.bmi AS "bmi"',
        'a.stone_history AS "stoneHistory"',
        'a.family_history AS "familyHistory"',
        'a.other_history AS "otherHistory"',
        'a.has_ultrasound AS "hasUltrasound"',
        'a.has_kub AS "hasKUB"',
        'a.has_ct AS "hasCT"',
        'a.has_mri AS "hasMRI"',
        'a.has_ctu AS "hasCTU"',
        'a.has_ivu AS "hasIVU"',
        'a.image_diagnosis AS "imageDiagnosis"',
        'a.anatomical_abnormal AS "anatomicalAbnormal"',
        'a.doctor AS "doctor"',
        'a.operator AS "operator"',
        'a.assessment_type AS "assessmentType"',
      ])
      .where('a.patient_no = :patientNo', { patientNo })
      .andWhere('a.deleted_at IS NULL')
      .orderBy('a.assessment_date', 'DESC');

    return await queryBuilder.getRawMany();
  }

  /**
   * 根据档案号、碎石号、评估次数、评估类型查询代谢评估内容
   */
  async getMuaContentByPatientNoAndSwlNo(params: {
    patientNo: string;
    swlNo: string;
    assessmentCount?: number;
    assessmentType?: string;
    _requestUserId?: number;
  }): Promise<any> {
    if (!params.patientNo) {
      throw new BizException('patientNo 不能为空');
    }
    if (!params.swlNo) {
      throw new BizException('swlNo 不能为空');
    }
    await this.assertPatientOwned(params.patientNo, params._requestUserId);

    const queryBuilder = this.muaContentEntity
      .createQueryBuilder('a')
      .select([
        'a.id AS "id"',
        'a.patient_no AS "patientNo"',
        'a.mua_no AS "swlNo"',
        'a.serial_number AS "serialNumber"',
        'a.assessment_count AS "assessmentCount"',
        'a.assessment_type AS "assessmentType"',
        'a.assessment_result AS "assessmentResult"',
        'a.treatment_suggestion AS "treatmentSuggestion"',
        'a.guide_suggestion AS "guideSuggestion"',
        'a.ai_guide_suggestion AS "aiGuideSuggestion"',
        'a.doctor AS "doctor"',
        'a.operator AS "operator"',
        'a.jbjx AS "jbjx"',
      ])
      .where('a.patient_no = :patientNo', { patientNo: params.patientNo })
      .andWhere('a.mua_no = :swlNo', { swlNo: params.swlNo });

    if (params.assessmentCount) {
      queryBuilder.andWhere('a.assessment_count = :assessmentCount', {
        assessmentCount: params.assessmentCount,
      });
    }

    if (params.assessmentType) {
      queryBuilder.andWhere('a.assessment_type = :assessmentType', {
        assessmentType: params.assessmentType,
      });
    }

    queryBuilder.orderBy('a.assessment_type', 'DESC').limit(1);

    return await queryBuilder.getRawOne();
  }
}