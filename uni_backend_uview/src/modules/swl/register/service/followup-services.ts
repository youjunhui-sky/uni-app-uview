import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlNearFollowup } from '../entity/swl-near-followup.entity';
import { SwlFutureFollowup } from '../entity/swl-future-followup.entity';
import { SwlCurative } from '../entity/swl-curative.entity';

async function findBySwlNo(repo: Repository<any>, swlNo: string, serialNumber?: string) {
  if (!swlNo) throw new BadRequestException('swlNo 不能为空');
  const qb = repo.createQueryBuilder('a').where('1=1');
  qb.andWhere('a.swl_no = :swlNo', { swlNo });
  if (serialNumber) qb.andWhere('a.serial_number = :serialNumber', { serialNumber });
  return qb.orderBy('a.followup_date', 'DESC').addOrderBy('a.id', 'DESC').getRawMany();
}
async function findById(repo: Repository<any>, id: number) {
  return repo.createQueryBuilder('a').where('a.id = :id', { id }).getRawOne();
}

@Injectable()
export class SwlNearFollowupService {
  constructor(@InjectRepository(SwlNearFollowup) private readonly repo: Repository<SwlNearFollowup>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

@Injectable()
export class SwlFutureFollowupService {
  constructor(@InjectRepository(SwlFutureFollowup) private readonly repo: Repository<SwlFutureFollowup>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

@Injectable()
export class SwlCurativeService {
  constructor(@InjectRepository(SwlCurative) private readonly repo: Repository<SwlCurative>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}
