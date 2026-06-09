import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 字典类别
 */
@Entity({
  name: 'dict_type',
  comment: '字典类别',
})
export class DictTypeEntity extends BaseEntity {
  @Column({ name: 'name', comment: '名称' })
  name: string;

  @Column({ name: 'key', comment: '标识' })
  key: string;
}