import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { MuaInfoEntity } from '../../entities/mua-info.entity';
import { MuaContentEntity } from '../../entities/mua-content.entity';

@Injectable()
export class EtiologyService {
  constructor(
    @InjectRepository(MuaInfoEntity)
    private readonly muaInfoEntity: Repository<MuaInfoEntity>,
    @InjectRepository(MuaContentEntity)
    private readonly muaContentEntity: Repository<MuaContentEntity>,
  ) {}

  /**
   * 根据档案号查询代谢评估信息 (与8081一致)
   */
  async getMuaInfoByPatientNo(patientNo: string, tenantId: number = 0): Promise<any[]> {
    const queryBuilder = this.muaInfoEntity
      .createQueryBuilder('a')
      .select([
        'a."id" AS "id"',
        'a."patientNo" AS "patientNo"',
        'a.mua_no AS "swlNo"',
        'a."serialNumber" AS "serialNumber"',
        'a."assessmentCount" AS "assessmentCount"',
        'a."outpatientNo" AS "outpatientNo"',
        'a."inpatientNo" AS "inpatientNo"',
        'a."bedNo" AS "bedNo"',
        'a."department" AS "department"',
        'a."assessmentDate" AS "assessmentDate"',
        'a."age" AS "age"',
        'a."height" AS "height"',
        'a."weight" AS "weight"',
        'a."bmi" AS "bmi"',
        'a."stoneHistory" AS "stoneHistory"',
        'a."familyHistory" AS "familyHistory"',
        'a."otherHistory" AS "otherHistory"',
        'a."hasUltrasound" AS "hasUltrasound"',
        'a."hasKUB" AS "hasKUB"',
        'a."hasCT" AS "hasCT"',
        'a."hasMRI" AS "hasMRI"',
        'a."hasCTU" AS "hasCTU"',
        'a."hasIVU" AS "hasIVU"',
        'a."imageDiagnosis" AS "imageDiagnosis"',
        'a."anatomicalAbnormal" AS "anatomicalAbnormal"',
        'a."doctor" AS "doctor"',
        'a."operator" AS "operator"',
        'a."assessmentType" AS "assessmentType"',
      ])
      .where('a."patientNo" = :patientNo', { patientNo })
      .andWhere('(a."tenantId" IS NULL OR a."tenantId" = :tenantId)', { tenantId })
      .andWhere('a."deletedAt" IS NULL')
      .orderBy('a."assessmentDate"', 'DESC');

    return await queryBuilder.getRawMany();
  }

  /**
   * 根据档案号、碎石号、评估次数、评估类型查询代谢评估内容 (与8081一致)
   */
  async getMuaContentByPatientNoAndSwlNo(params: {
    patientNo: string;
    swlNo: string;
    assessmentCount?: number;
    assessmentType?: string;
    tenantId?: number;
  }): Promise<any> {
    const tenantId = params.tenantId || 0;

    const queryBuilder = this.muaContentEntity
      .createQueryBuilder('a')
      .select([
        'a."id" AS "id"',
        'a."patientNo" AS "patientNo"',
        'a.mua_no AS "swlNo"',
        'a."serialNumber" AS "serialNumber"',
        'a."assessmentCount" AS "assessmentCount"',
        'a."assessmentType" AS "assessmentType"',
        'a."assessmentResult" AS "assessmentResult"',
        'a."treatmentSuggestion" AS "treatmentSuggestion"',
        'a."guideSuggestion" AS "guideSuggestion"',
        'a."aiGuideSuggestion" AS "aiGuideSuggestion"',
        'a."doctor" AS "doctor"',
        'a."operator" AS "operator"',
        'a."jbjx" AS "jbjx"',
      ])
      .where('a."patientNo" = :patientNo', { patientNo: params.patientNo })
      .andWhere('a.mua_no = :swlNo', { swlNo: params.swlNo });

    if (params.assessmentCount) {
      queryBuilder.andWhere('a."assessmentCount" = :assessmentCount', {
        assessmentCount: params.assessmentCount,
      });
    }

    if (params.assessmentType) {
      queryBuilder.andWhere('a."assessmentType" = :assessmentType', {
        assessmentType: params.assessmentType,
      });
    }

    if (tenantId === 0) {
      queryBuilder.andWhere('a."tenantId" IS NULL');
    } else {
      queryBuilder.andWhere('a."tenantId" = :tenantId', { tenantId });
    }

    queryBuilder.orderBy('a."assessmentType"', 'DESC').limit(1);

    return await queryBuilder.getRawOne();
  }
}