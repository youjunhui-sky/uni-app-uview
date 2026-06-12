import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlImagingExam } from '../entity/swl-exam.entity';

/**
 * SWL 影像检查服务（移动端简化版）
 */
@Injectable()
export class SwlImagingExamService {
  constructor(
    @InjectRepository(SwlImagingExam)
    private readonly repo: Repository<SwlImagingExam>,
  ) {}

  /**
   * 根据碎石号查询影像检查报告
   */
  async findBySwlNo(data: { swlNo: string; serialNumber?: string }) {
    if (!data.swlNo) {
      throw new BadRequestException('swlNo 不能为空');
    }
    const qb = this.repo.createQueryBuilder('a').where('1=1');
    if (data.swlNo) qb.andWhere('a.swl_no = :swlNo', { swlNo: data.swlNo });
    if (data.serialNumber) qb.andWhere('a.serial_number = :serialNumber', { serialNumber: data.serialNumber });
    return qb.orderBy('a.id', 'DESC').getRawMany();
  }

  async findById(id: number) {
    return this.repo
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .getRawOne();
  }
}
