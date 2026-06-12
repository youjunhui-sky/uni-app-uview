import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 参数配置实体（对齐 mdp 库 base.tsys_param）
 */
@Entity({
  name: 'tsys_param',
  schema: 'base',
  comment: '参数配置表',
})
export class BaseSysParamEntity {
  /** mdp 主键为 bigint（sequence: base.sys_param_id_seq） */
  @PrimaryGeneratedColumn({ type: 'bigint', comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Column({ name: 'key_name', comment: 'key', length: 100 })
  keyName: string;

  @Column({ comment: '名称', length: 100 })
  name: string;

  @Column({ comment: '值', type: 'text', nullable: true })
  data: string;

  /** mdp 库里 data_type 默认值是 0（与 herisdb 默认 1 不同） */
  @Column({ name: 'data_type', comment: '类型 0-JSON 1-字符串 2-逗号分隔', type: 'int', default: 0, nullable: true })
  dataType: number;

  @Column({ comment: '备注', length: 500, nullable: true })
  remark: string;
}
