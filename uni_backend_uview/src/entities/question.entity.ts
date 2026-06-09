import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 问题实体
 */
@Entity({
  name: 'tsys_question',
  comment: '问题',
})
export class QuestionEntity extends BaseEntity {
  @Column({ comment: '所属问卷ID' })
  questionnaireId: number;

  @Column({ comment: '问题标题', length: 500 })
  title: string;

  @Column({ comment: '问题类型', length: 20 })
  type: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '是否必填', default: false })
  required: boolean;

  @Column({ comment: '跳转逻辑', type: 'text', nullable: true })
  jump: string;

  @Column({ comment: '编号', length: 50 })
  bh: string;
}