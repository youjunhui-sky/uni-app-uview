import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlStoneComponent } from '../entity/swl-stone-component.entity';

@Injectable()
export class SwlStoneComponentService {
  constructor(
    @InjectRepository(SwlStoneComponent)
    private readonly repo: Repository<SwlStoneComponent>,
  ) {}

  async findBySwlNo(swlNo: string, serialNumber?: string) {
    if (!swlNo) throw new BadRequestException('swlNo 不能为空');
    const qb = this.repo.createQueryBuilder('a').where('1=1');
    qb.andWhere('a.swl_no = :swlNo', { swlNo });
    if (serialNumber) qb.andWhere('a.serial_number = :serialNumber', { serialNumber });
    return qb.orderBy('a.analysis_date', 'DESC').addOrderBy('a.id', 'DESC').getRawMany();
  }

  async findById(id: number) {
    return this.repo.createQueryBuilder('a').where('a.id = :id', { id }).getRawOne();
  }
}
