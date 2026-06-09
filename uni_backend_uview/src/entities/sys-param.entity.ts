import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 参数配置实体
 */
@Entity({
  name: 'base_sys_param',
  comment: '参数配置表',
})
export class BaseSysParamEntity extends BaseEntity {
  @Column({ name: 'name', comment: '名称', length: 100 })
  name: string;

  @Column({ name: 'keyName', comment: 'key', length: 100 })
  keyName: string;

  @Column({ name: 'data', comment: '值', type: 'text', nullable: true })
  data: string;

  @Column({ name: 'dataType', comment: '类型0-JSON 1-字符串 2-逗号分隔', default: 1 })
  dataType: number;

  @Column({ name: 'remark', comment: '备注', length: 500, nullable: true })
  remark: string;
}