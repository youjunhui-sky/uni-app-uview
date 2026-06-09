import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionnaireEntity } from '../../entities/questionnaire.entity';
import { QuestionEntity } from '../../entities/question.entity';
import { OptionEntity } from '../../entities/option.entity';
import { BaseSysParamEntity } from '../../entities/sys-param.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireEntity)
    private readonly questionnaireEntity: Repository<QuestionnaireEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionEntity: Repository<QuestionEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionEntity: Repository<OptionEntity>,
    @InjectRepository(BaseSysParamEntity)
    private readonly baseSysParamEntity: Repository<BaseSysParamEntity>,
  ) {}

  /**
   * 根据问卷ID获取问卷列表和对应的选项 (与8081一致)
   */
  async getQuestionsWithOptions(id?: number): Promise<any> {
    // 如果未提供 id，则从系统参数中获取默认问卷ID
    if (!id || Number.isNaN(Number(id))) {
      const cfg = await this.baseSysParamEntity.findOneBy({ keyName: 'questionnaireId' });
      if (cfg && cfg.data) {
        try {
          id = JSON.parse(cfg.data);
        } catch {
          id = Number(cfg.data) || undefined;
        }
      }
    }

    if (!id || Number.isNaN(Number(id))) {
      return null;
    }

    // 基础问卷信息
    const questionnaire = await this.questionnaireEntity.findOneBy({ id });
    if (!questionnaire) {
      return null;
    }

    // 如果问卷未发布，则返回null (与8081一致，使用 == 比较)
    if (questionnaire.published == false) {
      return null;
    }

    // 获取问题列表（升序）
    const questions = await this.questionEntity.find({
      where: { questionnaireId: id },
      order: { sort: 'ASC' },
    });

    if (questions.length === 0) {
      return {
        id: questionnaire.id,
        title: questionnaire.title,
        description: questionnaire.description,
        questions: [],
      };
    }

    // 获取所有选项（按问卷ID，升序）
    const options = await this.optionEntity.find({
      where: { questionnaireId: id },
      order: { sort: 'ASC' },
    });

    // 选项按 questionId 归组
    const optionMap = new Map<number, OptionEntity[]>();
    for (const opt of options) {
      const arr = optionMap.get(opt.questionId) || [];
      arr.push(opt);
      optionMap.set(opt.questionId, arr);
    }

    // 组装结果结构
    const resultQuestions = questions.map(q => ({
      id: q.id,
      title: q.title,
      type: q.type,
      sort: q.sort,
      required: q.required,
      bh: q.bh,
      jump: q.jump ? (typeof q.jump === 'string' ? JSON.parse(q.jump) : q.jump) : {},
      options: (optionMap.get(q.id) || []).map(o => ({
        content: o.content,
        sort: o.sort,
        option: o.bh,
        other: o.other,
      })),
    }));

    // 最终问题列表按 sort 升序
    resultQuestions.sort((a, b) => (a.sort || 0) - (b.sort || 0));

    return {
      id: questionnaire.id,
      title: questionnaire.title,
      description: questionnaire.description,
      questions: resultQuestions,
    };
  }
}