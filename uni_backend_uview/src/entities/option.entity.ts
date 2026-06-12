import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 选项实体（对齐 mdp 库 base.tsys_option）
 */
@Entity({
  name: 'tsys_option',
  schema: 'base',
  comment: '选项',
})
export class OptionEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'questionnaire_id', comment: '所属问卷ID', type: 'int' })
  questionnaireId: number;

  @Column({ name: 'question_id', comment: '所属问题ID', type: 'int' })
  questionId: number;

  @Column({ comment: '选项内容', length: 255 })
  content: string;

  @Column({ comment: '排序', type: 'int', default: 0, nullable: true })
  sort: number;

  /** mdp 库里 score 是可空的（与 herisdb NOT NULL 不同） */
  @Column({ comment: '选项分值', type: 'int', nullable: true })
  score: number;

  @Column({ comment: '编号', length: 50 })
  bh: string;

  @Column({ comment: '其他', default: false, nullable: true })
  other: boolean;
}
