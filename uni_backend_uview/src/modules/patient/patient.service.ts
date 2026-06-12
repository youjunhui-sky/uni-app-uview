import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like, DataSource } from 'typeorm';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientInfoEntity)
    private readonly patientInfoEntity: Repository<PatientInfoEntity>,
    @InjectRepository(PatientUserEntity)
    private readonly patientUserEntity: Repository<PatientUserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * 获取用户就诊人列表 (与8081一致)
   */
  async getByUserId(userId: number): Promise<any[]> {
    const queryBuilder = this.patientUserEntity
      .createQueryBuilder('a')
      .select([
        'a.id as "id"',
        'a.tenantId as "tenantId"',
        'a.patientNo as "patientNo"',
        'a.userId as "userId"',
        'a.default as "default"',
        'b."name" as "name"',
        'b."idCard" as "idCard"',
        'b."gender" as "gender"',
        'b."mobile" as "mobile"',
        'b."occupation" as "occupation"',
        'b."id" as "patientId"',
      ])
      .leftJoin(
        PatientInfoEntity,
        'b',
        'a."patientNo" = b."patientNo" and COALESCE(a."tenantId", 0) = COALESCE(b."tenantId", 0)'
      );

    queryBuilder.andWhere('a."userId" = :userId', { userId: userId });
    return await queryBuilder.getRawMany();
  }

  /**
   * 获取当前就诊人 (与8081一致)
   */
  async getCurrentPatient(userId: number): Promise<any> {
    const patients = await this.getByUserId(userId);
    const defaultPatient = patients.find((item) => item.default === 1);
    return defaultPatient || patients[0] || null;
  }

  /**
   * 按用户ID和档案号查询 (与8081一致)
   */
  async getByUserIdAndPatientNo(params: { userId: number; patientNo: string }): Promise<any[]> {
    const queryBuilder = this.patientUserEntity
      .createQueryBuilder('a')
      .select([
        'a.id as "id"',
        'a.tenantId as "tenantId"',
        'a.patientNo as "patientNo"',
        'a.userId as "userId"',
        'a.default as "default"',
        'b."name" as "name"',
        'b."idCard" as "idCard"',
        'b."gender" as "gender"',
        'b."mobile" as "mobile"',
        'b."occupation" as "occupation"',
        'b."id" as "patientId"',
      ])
      .leftJoin(
        PatientInfoEntity,
        'b',
        'a."patientNo" = b."patientNo" and COALESCE(a."tenantId", 0) = COALESCE(b."tenantId", 0)'
      );

    queryBuilder.andWhere('a."userId" = :userId', { userId: params.userId });
    queryBuilder.andWhere('a."patientNo" = :patientNo', { patientNo: params.patientNo });
    return await queryBuilder.getRawMany();
  }

  /**
   * 添加就诊人 (与8081一致)
   */
  async addPatientUser(params: any): Promise<any> {
    // 验证必填参数
    if (!params.userId || params.userId === '') {
      throw new Error('用户id不能为空');
    }
    if (!params.idCard || params.idCard === '') {
      throw new Error('身份证号不能为空');
    }
    if (!params.name || params.name === '') {
      throw new Error('姓名不能为空');
    }

    // 档案号为空，先查找或创建档案
    if (!params.patientNo) {
      const patientInfo = await this.getByIdCardAndName(params.idCard, params.name);

      if (patientInfo && patientInfo.length > 0) {
        // 患者档案已存在，直接复用 patientNo
        params.patientNo = patientInfo[0].patientNo;
      } else {
        // 患者档案不存在，创建新档案
        const registerDate = params.registerDate || new Date().toISOString().split('T')[0];
        const newPatientNo = await this.generatePatientNo(registerDate);
        const now = new Date();
        await this.patientInfoEntity.save({
          patientNo: newPatientNo,
          idCard: params.idCard,
          name: params.name,
          gender: params.gender,
          birthDate: params.birthDate,
          mobile: params.mobile,
          occupation: params.occupation,
          registerDate,
          createdAt: now,
          updatedAt: now,
        });
        params.patientNo = newPatientNo;
      }
    }

    const patientUserParams: any = {
      patientNo: params.patientNo,
      userId: params.userId,
      default: params.default === null || params.default === undefined || params.default === '' ? 0 : params.default,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 如果设置默认，先取消其他默认
    if (params.default > 0) {
      await this.updateDefaultByUserId(params.userId, 0);
    }

    return await this.patientUserEntity.save(patientUserParams);
  }

  /**
   * 生成档案号：YYYYMMDD + 3位序号
   * @param registerDate 登记日期（YYYY-MM-DD）
   */
  private async generatePatientNo(registerDate: string): Promise<string> {
    const dateFormat = (registerDate || '').replace(/-/g, '').substring(0, 8);
    const today = dateFormat || new Date().toISOString().split('T')[0].replace(/-/g, '');

    const list = await this.patientInfoEntity.find({
      where: { patientNo: Like(`${today}%`) },
      order: { patientNo: 'DESC' },
    });

    if (list && list.length > 0) {
      const max = list[0].patientNo;
      if (max && max.startsWith(today)) {
        const seq = parseInt(max.substring(8), 10);
        if (!isNaN(seq)) {
          return `${today}${String(seq + 1).padStart(3, '0')}`;
        }
      }
    }
    return `${today}001`;
  }

  /**
   * 设置默认就诊人 (与8081一致)
   */
  async updateDefault(data: { userId: number; patientUserId: string }): Promise<void> {
    await this.updateDefaultByUserId(data.userId, 0);
    await this.patientUserEntity.update(
      { userId: data.userId, patientNo: data.patientUserId },
      { default: 1 }
    );
  }

  /**
   * 删除就诊人（支持批量）(与8081一致)
   * @param ids 档案关联 id 列表
   */
  async deletePatientUser(ids: number[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) {
      return;
    }
    await this.patientUserEntity.delete(ids);
  }

  /**
   * 分页查询患者 (与8081一致)
   */
  async pagePatient(params: any): Promise<any> {
    const { size = 15, page = 1, name, patientNo, idCard, mobile, ...rest } = params;

    const queryBuilder = this.patientInfoEntity.createQueryBuilder('g');
    queryBuilder.andWhere('g."deletedAt" IS NULL');

    if (name) {
      queryBuilder.andWhere('g."name" LIKE :name', { name: `%${name}%` });
    }
    if (patientNo) {
      queryBuilder.andWhere('g."patientNo" = :patientNo', { patientNo });
    }
    if (idCard) {
      queryBuilder.andWhere('g."idCard" = :idCard', { idCard });
    }
    if (mobile) {
      queryBuilder.andWhere('g."mobile" = :mobile', { mobile });
    }

    const total = await queryBuilder.getCount();
    const list = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .orderBy('g."registerDate"', 'DESC')
      .getMany();

    return {
      list,
      pagination: { page: parseInt(page), size: parseInt(size), total },
    };
  }

  /**
   * 获取患者详情 (与8081一致)
   * 注：mdp 中 tbus_patient_info.id 为 uuid（string），不再 parseInt
   */
  async getPatientInfo(id: string): Promise<any> {
    return await this.patientInfoEntity.findOneBy({ id });
  }

  /**
   * 更新患者信息 (与8081一致)
   */
  async updatePatientInfo(data: any): Promise<void> {
    const id = data.id;
    delete data.id;
    await this.patientInfoEntity.update(id, data);
  }

  /**
   * 按证件号姓名查询 (与8081一致)
   */
  async getByIdCardAndName(idCard: string, name: string): Promise<any[]> {
    return await this.patientInfoEntity.find({
      where: { idCard, name, deletedAt: IsNull() },
    });
  }

  // 内部方法
  private async updateDefaultByUserId(userId: number, defaultVal: number): Promise<void> {
    await this.patientUserEntity.update({ userId }, { default: defaultVal });
  }
}