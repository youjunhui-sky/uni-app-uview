import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 问卷实体（对齐 mdp 库 base.tsys_questionnaire）
 */
@Entity({
  name: 'tsys_questionnaire',
  schema: 'base',
  comment: '问卷',
})
export class QuestionnaireEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Column({ comment: '问卷标题', length: 255 })
  title: string;

  @Column({ comment: '问卷描述', type: 'text', nullable: true })
  description: string;

  /** mdp 库里 creator_id 是可空的（与 herisdb NOT NULL 不同） */
  @Column({ name: 'creator_id', comment: '创建人ID', type: 'int', nullable: true })
  creatorId: number;

  @Column({ comment: '是否发布', default: false, nullable: true })
  published: boolean;

  @Column({ name: 'deleted_at', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ comment: '排序', type: 'int', default: 0, nullable: true })
  sort: number;
}
