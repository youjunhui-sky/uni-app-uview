import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 字典类别实体（对齐 mdp 库 base.tsys_dict_type）
 */
@Entity({
  name: 'tsys_dict_type',
  schema: 'base',
  comment: '字典类别',
})
export class DictTypeEntity {
  /** mdp 主键为 bigint（sequence: base.sys_dict_type_id_seq） */
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

  @Column({ comment: '标识', length: 100 })
  key: string;

  @Column({ comment: '状态 0-禁用 1-启用', type: 'smallint', default: 1, nullable: true })
  status: number;

  @Column({ comment: '模块', length: 50, nullable: true })
  module: string;
}
