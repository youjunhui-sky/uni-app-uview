import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 问卷答案实体
 * 目标表：base.tquestionnaire_answer
 *
 * 注：mdp 库当前无此表，需 DBA 在 mdp 库 base schema 下建表
 * （见 scripts/ddl/tquestionnaire_answer.ddl）。
 */
@Entity({
  name: 'tquestionnaire_answer',
  schema: 'base',
  comment: '问卷答案',
})
export class QuestionnaireAnswerEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Index()
  @Column({ name: 'patient_no', comment: '档案号', length: 20 })
  patientNo: string;

  @Index()
  @Column({ name: 'questionnaire_id', comment: '问卷ID', type: 'int' })
  questionnaireId: number;

  /**
   * 答案明细，jsonb 存：
   *   { answers: [{ bh, value, option, other }] }
   * 与前端 questionnaire/index.vue 的 finalJson 结构一致。
   */
  @Column({ name: 'answers', type: 'jsonb', comment: '答案明细 jsonb' })
  answers: any;
}
