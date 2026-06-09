import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 问卷实体
 */
@Entity({
  name: 'tsys_questionnaire',
  comment: '问卷',
})
export class QuestionnaireEntity extends BaseEntity {
  @Column({ comment: '问卷标题', length: 255 })
  title: string;

  @Column({ comment: '问卷描述', type: 'text', nullable: true })
  description: string;

  @Column({ comment: '创建人ID' })
  creatorId: number;

  @Column({ comment: '是否发布', default: false })
  published: boolean;

  @Column({ name: 'deletedAt', comment: '删除时间', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ comment: '排序', default: 0 })
  sort: number;
}