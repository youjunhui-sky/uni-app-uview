import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as _ from 'lodash';
import { DictTypeEntity } from '../../entities/dict-type.entity';
import { DictInfoEntity } from '../../entities/dict-info.entity';

@Injectable()
export class DictService {
  constructor(
    @InjectRepository(DictTypeEntity)
    private readonly dictTypeEntity: Repository<DictTypeEntity>,
    @InjectRepository(DictInfoEntity)
    private readonly dictInfoEntity: Repository<DictInfoEntity>,
  ) {}

  /**
   * 获取字典类型列表 (与8081一致)
   */
  async getTypes(): Promise<DictTypeEntity[]> {
    return await this.dictTypeEntity.find();
  }

  /**
   * 获取字典数据 (与8081一致)
   */
  async getData(types: string[]): Promise<Record<string, any[]>> {
    const result: Record<string, any[]> = {};

    let typeData = await this.dictTypeEntity.find();
    if (!_.isEmpty(types)) {
      typeData = await this.dictTypeEntity.findBy({ key: In(types) });
    }
    if (_.isEmpty(typeData)) {
      return {};
    }

    const data = await this.dictInfoEntity
      .createQueryBuilder('a')
      .select(['a.id', 'a.name', 'a.typeId', 'a.parentId', 'a.orderNum', 'a.value'])
      .where('a.typeId IN (:...typeIds)', {
        typeIds: typeData.map(e => e.id),
      })
      .orderBy('a.orderNum', 'ASC')
      .addOrderBy('a.createTime', 'ASC')
      .getMany();

    for (const item of typeData) {
      result[item.key] = _.filter(data, { typeId: item.id }).map(e => {
        const value = e.value ? Number(e.value) : e.value;
        return {
          ...e,
          value: isNaN(value) ? e.value : value,
        };
      });
    }

    return result;
  }
}