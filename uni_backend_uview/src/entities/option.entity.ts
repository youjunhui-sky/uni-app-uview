import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 选项实体
 */
@Entity({
  name: 'tsys_option',
  comment: '选项',
})
export class OptionEntity extends BaseEntity {
  @Column({ comment: '所属问卷ID' })
  questionnaireId: number;

  @Column({ comment: '所属问题ID' })
  questionId: number;

  @Column({ comment: '选项内容', length: 255 })
  content: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ comment: '选项分值' })
  score: number;

  @Column({ comment: '编号', length: 50 })
  bh: string;

  @Column({ comment: '其他', default: false })
  other: boolean;
}