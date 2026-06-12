import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlRegister } from '../entity/swl-info.entity';
import { PatientUserEntity } from '../../../../entities/patient-user.entity';
import { PatientInfoEntity } from '../../../../entities/patient-info.entity';
import { BizException } from '../../../../common/exceptions';

/**
 * SWL 就诊登记服务（移动端简化版）
 * 仅提供列表查询与归属校验，其他功能（新增/编辑/删除）后续按需移植
 */
@Injectable()
export class SwlRegisterService {
  constructor(
    @InjectRepository(SwlRegister)
    private readonly swlRegisterRepo: Repository<SwlRegister>,
    @InjectRepository(PatientUserEntity)
    private readonly patientUserEntity: Repository<PatientUserEntity>,
    @InjectRepository(PatientInfoEntity)
    private readonly patientInfoEntity: Repository<PatientInfoEntity>,
  ) {}

  /**
   * 越权防御：校验 patientNo 归属当前 userId
   * 与 etiology.service.ts 行为一致
   */
  private async assertPatientOwned(
    patientNo: string,
    requestUserId: number | undefined,
  ): Promise<void> {
    if (!requestUserId) {
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
   * 根据档案号查询 SWL 诊疗记录列表
   * 关联患者表以获取姓名/性别等展示字段
   */
  async getByPatientNo(patientNo: string, requestUserId?: number) {
    if (!patientNo) {
      throw new BizException('patientNo 不能为空');
    }
    await this.assertPatientOwned(patientNo, requestUserId);

    const list = await this.swlRegisterRepo
      .createQueryBuilder('a')
      .leftJoin(PatientInfoEntity, 'p', 'a.patient_no = p.patient_no')
      .where('a.patient_no = :patientNo', { patientNo })
      .andWhere('a.deleted_at IS NULL')
      .select([
        'a.id AS "id"',
        'a.patient_no AS "patientNo"',
        'a.swl_no AS "swlNo"',
        'a.serial_number AS "serialNumber"',
        'a.department AS "department"',
        "TO_CHAR(a.visit_date, 'YYYY-MM-DD') AS \"visitDate\"",
        'a.age AS "age"',
        'a.sequence_no AS "sequenceNo"',
        'a.episode AS "episode"',
        'a.height AS "height"',
        'a.weight AS "weight"',
        'a.bmi AS "bmi"',
        'a.special_condition AS "specialCondition"',
        'a.doctor AS "doctor"',
        'p.name AS "name"',
        'p.gender AS "gender"',
        'p.mobile AS "mobile"',
      ])
      .orderBy('a.visit_date', 'DESC')
      .addOrderBy('a.id', 'DESC')
      .getRawMany();

    return list;
  }

  /**
   * 根据主键查询 SWL 诊疗详情
   */
  async getById(id: number) {
    if (!id) {
      throw new BizException('id 不能为空');
    }
    const detail = await this.swlRegisterRepo
      .createQueryBuilder('a')
      .leftJoin(PatientInfoEntity, 'p', 'a.patient_no = p.patient_no')
      .where('a.id = :id', { id })
      .andWhere('a.deleted_at IS NULL')
      .select([
        'a.id AS "id"',
        'a.patient_no AS "patientNo"',
        'a.swl_no AS "swlNo"',
        'a.serial_number AS "serialNumber"',
        'a.department AS "department"',
        "TO_CHAR(a.visit_date, 'YYYY-MM-DD') AS \"visitDate\"",
        'a.outpatient_no AS "outpatientNo"',
        'a.inpatient_no AS "inpatientNo"',
        'a.bed_no AS "bedNo"',
        'a.age AS "age"',
        'a.sequence_no AS "sequenceNo"',
        'a.episode AS "episode"',
        'a.height AS "height"',
        'a.weight AS "weight"',
        'a.bmi AS "bmi"',
        'a.special_condition AS "specialCondition"',
        'a.doctor AS "doctor"',
        'p.name AS "name"',
        'p.gender AS "gender"',
        'p.id_card AS "idCard"',
        'p.mobile AS "mobile"',
        "TO_CHAR(p.birth_date, 'YYYY-MM-DD') AS \"birthDate\"",
      ])
      .getRawOne();
    if (!detail) {
      throw new BizException('SWL 诊疗记录不存在');
    }
    return detail;
  }
}
