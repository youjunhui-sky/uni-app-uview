import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlTreatment } from '../entity/swl-treatment.entity';

/**
 * SWL 治疗记录服务（移动端简化版）
 * 返回所有字段，供前端展示
 */
@Injectable()
export class SwlTreatmentService {
  constructor(
    @InjectRepository(SwlTreatment)
    private readonly repo: Repository<SwlTreatment>,
  ) {}

  /**
   * 根据碎石号 + 流水号查询治疗记录列表（包含全部字段）
   */
  async findBySwlNo(data: { swlNo: string; serialNumber?: string; episode?: number }) {
    if (!data.swlNo) {
      throw new BadRequestException('swlNo 不能为空');
    }
    const qb = this.repo.createQueryBuilder('a').where('1=1');
    if (data.swlNo) qb.andWhere('a.swl_no = :swlNo', { swlNo: data.swlNo });
    if (data.serialNumber) qb.andWhere('a.serial_number = :serialNumber', { serialNumber: data.serialNumber });
    const list = await qb
      .orderBy('a.episode', 'DESC')
      .addOrderBy('a.sequence_no', 'DESC')
      .getRawMany();
    return list;
  }

  /**
   * 根据主键查询单条详情
   */
  async findById(id: number) {
    return this.repo
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .getRawOne();
  }
}
