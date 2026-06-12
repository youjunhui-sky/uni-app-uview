import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 字典信息实体（对齐 mdp 库 base.tsys_dict_info）
 */
@Entity({
  name: 'tsys_dict_info',
  schema: 'base',
  comment: '字典信息',
})
export class DictInfoEntity {
  /** mdp 主键为 bigint（sequence: base.sys_dict_info_id_seq） */
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Column({ comment: '名称', length: 100 })
  name: string;

  @Column({ comment: '值', length: 255, nullable: true })
  value: string;

  /** mdp 库里 type_id 是 bigint（与 herisdb int 不同） */
  @Column({ name: 'type_id', comment: '类型ID', type: 'bigint' })
  typeId: number;

  /** mdp 库里 parent_id 是 varchar(100)（与 herisdb int 不同） */
  @Column({ name: 'parent_id', comment: '父ID', length: 100, nullable: true })
  parentId: string;

  @Column({ name: 'order_num', comment: '排序', type: 'int', default: 0, nullable: true })
  orderNum: number;

  @Column({ comment: '备注', length: 500, nullable: true })
  remark: string;

  @Column({ comment: '状态 0-禁用 1-启用', type: 'smallint', default: 1, nullable: true })
  status: number;
}
