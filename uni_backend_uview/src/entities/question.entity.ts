import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 问题实体（对齐 mdp 库 base.tsys_question）
 */
@Entity({
  name: 'tsys_question',
  schema: 'base',
  comment: '问题',
})
export class QuestionEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Column({ name: 'questionnaire_id', comment: '所属问卷ID', type: 'int' })
  questionnaireId: number;

  @Column({ comment: '问题标题', length: 500 })
  title: string;

  @Column({ comment: '问题类型', length: 20 })
  type: string;

  @Column({ comment: '排序', type: 'int', default: 0, nullable: true })
  sort: number;

  @Column({ comment: '是否必填', default: false, nullable: true })
  required: boolean;

  @Column({ comment: '跳转逻辑', type: 'text', nullable: true })
  jump: string;

  @Column({ comment: '编号', length: 50 })
  bh: string;
}
