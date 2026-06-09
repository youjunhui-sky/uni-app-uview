import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 字典信息
 */
@Entity({
  name: 'dict_info',
  comment: '字典信息',
})
export class DictInfoEntity extends BaseEntity {
  @Column({ name: 'typeId', comment: '类型ID' })
  typeId: number;

  @Column({ name: 'name', comment: '名称' })
  name: string;

  @Column({ name: 'value', comment: '值', nullable: true })
  value: string;

  @Column({ name: 'orderNum', comment: '排序', default: 0 })
  orderNum: number;

  @Column({ name: 'remark', comment: '备注', nullable: true })
  remark: string;

  @Column({ name: 'parentId', comment: '父ID', default: null })
  parentId: number;
}