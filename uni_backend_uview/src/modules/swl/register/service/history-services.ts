import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwlCurrentHistory } from '../entity/swl-current-history.entity';
import { SwlPastMedicalHistory } from '../entity/swl-pastmedical.entity';
import { SwlFamilyHistory } from '../entity/swl-family.entity';
import { SwlPastStoneHistory } from '../entity/swl-paststone.entity';
import { SwlPersonalHistory } from '../entity/swl-personal.entity';
import { SwlMenstrualMarriageHistory } from '../entity/swl-menstrual.entity';
import { SwlVitalSigns } from '../entity/swl-vital.entity';
import { SwlLabResultDetail } from '../entity/swl-lab.entity';
import { SwlDiagnosis } from '../entity/swl-diagnosis.entity';

/** 通用：根据 swlNo + serialNumber 返回数据 */
async function findBySwlNo(
  repo: Repository<any>,
  swlNo: string,
  serialNumber?: string,
) {
  if (!swlNo) throw new BadRequestException('swlNo 不能为空');
  const qb = repo.createQueryBuilder('a').where('1=1');
  qb.andWhere('a.swl_no = :swlNo', { swlNo });
  if (serialNumber) {
    qb.andWhere('a.serial_number = :serialNumber', { serialNumber });
  }
  return qb.orderBy('a.id', 'ASC').getRawMany();
}

async function findById(repo: Repository<any>, id: number) {
  return repo.createQueryBuilder('a').where('a.id = :id', { id }).getRawOne();
}

// ============= 现病史 =============
@Injectable()
export class SwlCurrentHistoryService {
  constructor(@InjectRepository(SwlCurrentHistory) private readonly repo: Repository<SwlCurrentHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 既往史 =============
@Injectable()
export class SwlPastMedicalHistoryService {
  constructor(@InjectRepository(SwlPastMedicalHistory) private readonly repo: Repository<SwlPastMedicalHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 家族史 =============
@Injectable()
export class SwlFamilyHistoryService {
  constructor(@InjectRepository(SwlFamilyHistory) private readonly repo: Repository<SwlFamilyHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 既往结石病史 =============
@Injectable()
export class SwlPastStoneHistoryService {
  constructor(@InjectRepository(SwlPastStoneHistory) private readonly repo: Repository<SwlPastStoneHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 个人史 =============
@Injectable()
export class SwlPersonalHistoryService {
  constructor(@InjectRepository(SwlPersonalHistory) private readonly repo: Repository<SwlPersonalHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 月经婚育史 =============
@Injectable()
export class SwlMenstrualMarriageHistoryService {
  constructor(@InjectRepository(SwlMenstrualMarriageHistory) private readonly repo: Repository<SwlMenstrualMarriageHistory>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 体征 =============
@Injectable()
export class SwlVitalSignsService {
  constructor(@InjectRepository(SwlVitalSigns) private readonly repo: Repository<SwlVitalSigns>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 检验 =============
@Injectable()
export class SwlLabResultDetailService {
  constructor(@InjectRepository(SwlLabResultDetail) private readonly repo: Repository<SwlLabResultDetail>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}

// ============= 诊断 =============
@Injectable()
export class SwlDiagnosisService {
  constructor(@InjectRepository(SwlDiagnosis) private readonly repo: Repository<SwlDiagnosis>) {}
  findBySwlNo(swlNo: string, serialNumber?: string) { return findBySwlNo(this.repo, swlNo, serialNumber); }
  findById(id: number) { return findById(this.repo, id); }
}
