import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Like } from 'typeorm';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { QuestionnaireAnswerEntity } from '../../entities/questionnaire-answer.entity';
import { QuestionEntity } from '../../entities/question.entity';
import { OptionEntity } from '../../entities/option.entity';
import { BizException } from '../../common/exceptions';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientInfoEntity)
    private readonly patientInfoEntity: Repository<PatientInfoEntity>,
    @InjectRepository(PatientUserEntity)
    private readonly patientUserEntity: Repository<PatientUserEntity>,
    @InjectRepository(QuestionnaireAnswerEntity)
    private readonly questionnaireAnswerEntity: Repository<QuestionnaireAnswerEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionEntity: Repository<QuestionEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionEntity: Repository<OptionEntity>,
  ) {}

  /**
   * 获取用户就诊人列表 (与8081一致)
   */
  async getByUserId(userId: number): Promise<any[]> {
    const queryBuilder = this.patientUserEntity
      .createQueryBuilder('a')
      .select([
        'a.id as "id"',
        'a.patient_no as "patientNo"',
        'a.user_id as "userId"',
        'a.default as "default"',
        'b.name as "name"',
        'b.id_card as "idCard"',
        'b.gender as "gender"',
        'b.mobile as "mobile"',
        'b.occupation as "occupation"',
        'b.id as "patientId"',
      ])
      .leftJoin(
        PatientInfoEntity,
        'b',
        'a.patient_no = b.patient_no'
      );

    queryBuilder.andWhere('a.user_id = :userId', { userId: userId });
    return await queryBuilder.getRawMany();
  }

  /**
   * 获取当前就诊人 (与8081一致)
   */
  async getCurrentPatient(userId: number): Promise<any> {
    const patients = await this.getByUserId(userId);
    const defaultPatient = patients.find((item) => item.default === 1);
    return defaultPatient || patients[0] || null;
  }

  /**
   * 按用户ID和档案号查询 (与8081一致)
   */
  async getByUserIdAndPatientNo(params: { userId: number; patientNo: string }): Promise<any[]> {
    const queryBuilder = this.patientUserEntity
      .createQueryBuilder('a')
      .select([
        'a.id as "id"',
        'a.patient_no as "patientNo"',
        'a.user_id as "userId"',
        'a.default as "default"',
        'b.name as "name"',
        'b.id_card as "idCard"',
        'b.gender as "gender"',
        'b.mobile as "mobile"',
        'b.occupation as "occupation"',
        'b.id as "patientId"',
      ])
      .leftJoin(
        PatientInfoEntity,
        'b',
        'a.patient_no = b.patient_no'
      );

    queryBuilder.andWhere('a.user_id = :userId', { userId: params.userId });
    queryBuilder.andWhere('a.patient_no = :patientNo', { patientNo: params.patientNo });
    return await queryBuilder.getRawMany();
  }

  /**
   * 添加就诊人 (与8081一致)
   */
  async addPatientUser(params: any): Promise<any> {
    // 验证必填参数
    if (!params.userId || params.userId === '') {
      throw new Error('用户id不能为空');
    }
    if (!params.idCard || params.idCard === '') {
      throw new Error('身份证号不能为空');
    }
    if (!params.name || params.name === '') {
      throw new Error('姓名不能为空');
    }

    // 档案号为空，先查找或创建档案
    if (!params.patientNo) {
      const patientInfo = await this.getByIdCardAndName(params.idCard, params.name);

      if (patientInfo && patientInfo.length > 0) {
        // 患者档案已存在，直接复用 patientNo
        params.patientNo = patientInfo[0].patientNo;
      } else {
        // 患者档案不存在，创建新档案
        const registerDate = params.registerDate || new Date().toISOString().split('T')[0];
        const newPatientNo = await this.generatePatientNo(registerDate);
        const now = new Date();
        await this.patientInfoEntity.save({
          patientNo: newPatientNo,
          idCard: params.idCard,
          name: params.name,
          gender: params.gender,
          birthDate: params.birthDate,
          mobile: params.mobile,
          occupation: params.occupation,
          registerDate,
          createdAt: now,
          updatedAt: now,
        });
        params.patientNo = newPatientNo;
      }
    }

    const patientUserParams: any = {
      patientNo: params.patientNo,
      userId: params.userId,
      default: params.default === null || params.default === undefined || params.default === '' ? 0 : params.default,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 如果设置默认，先取消其他默认
    if (params.default > 0) {
      await this.updateDefaultByUserId(params.userId, 0);
    }

    return await this.patientUserEntity.save(patientUserParams);
  }

  /**
   * 生成档案号：YYYYMMDD + 3位序号
   * @param registerDate 登记日期（YYYY-MM-DD）
   */
  private async generatePatientNo(registerDate: string): Promise<string> {
    const dateFormat = (registerDate || '').replace(/-/g, '').substring(0, 8);
    const today = dateFormat || new Date().toISOString().split('T')[0].replace(/-/g, '');

    const list = await this.patientInfoEntity.find({
      where: { patientNo: Like(`${today}%`) },
      order: { patientNo: 'DESC' },
    });

    if (list && list.length > 0) {
      const max = list[0].patientNo;
      if (max && max.startsWith(today)) {
        const seq = parseInt(max.substring(8), 10);
        if (!isNaN(seq)) {
          return `${today}${String(seq + 1).padStart(3, '0')}`;
        }
      }
    }
    return `${today}001`;
  }

  /**
   * 设置默认就诊人 (与8081一致)
   * @param data.userId 用户ID
   * @param data.patientNo 档案号（不是 patient_user 关联表的 id！）
   */
  async updateDefault(data: { userId: number; patientNo: string }): Promise<void> {
    if (!data.userId || !data.patientNo) {
      throw new Error('userId 和 patientNo 不能为空');
    }
    await this.updateDefaultByUserId(data.userId, 0);
    const result = await this.patientUserEntity.update(
      { userId: data.userId, patientNo: data.patientNo },
      { default: 1 }
    );
    // TypeORM 静默处理 0 行受影响：若 patientNo 拼错 / 该用户下没这条档案，
    // 上面 update 不会抛错。这里强制校验，避免上游以为成功了。
    if (!result.affected || result.affected === 0) {
      throw new Error(
        `设置默认就诊人失败：未找到 userId=${data.userId} patientNo=${data.patientNo} 的关联记录`,
      );
    }
  }

  /**
   * 删除就诊人（支持批量）(与8081一致)
   * @param ids 档案关联 id 列表
   */
  async deletePatientUser(ids: number[]): Promise<void> {
    if (!Array.isArray(ids) || ids.length === 0) {
      return;
    }
    await this.patientUserEntity.delete(ids);
  }

  /**
   * 分页查询患者 (与8081一致)
   */
  async pagePatient(params: any): Promise<any> {
    const { size = 15, page = 1, name, patientNo, idCard, mobile } = params;

    const queryBuilder = this.patientInfoEntity.createQueryBuilder('g');
    queryBuilder.andWhere('g.deleted_at IS NULL');

    if (name) {
      queryBuilder.andWhere('g.name LIKE :name', { name: `%${name}%` });
    }
    if (patientNo) {
      queryBuilder.andWhere('g.patient_no = :patientNo', { patientNo });
    }
    if (idCard) {
      queryBuilder.andWhere('g.id_card = :idCard', { idCard });
    }
    if (mobile) {
      queryBuilder.andWhere('g.mobile = :mobile', { mobile });
    }

    const total = await queryBuilder.getCount();
    const list = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .orderBy('g.register_date', 'DESC')
      .getMany();

    return {
      list,
      pagination: { page: parseInt(page), size: parseInt(size), total },
    };
  }

  /**
   * 获取患者详情 (与8081一致)
   * 注：mdp 中 tbus_patient_info.id 为 uuid（string），不再 parseInt
   */
  async getPatientInfo(id: string): Promise<any> {
    return await this.patientInfoEntity.findOneBy({ id });
  }

  /**
   * 更新患者信息 (与8081一致)
   */
  async updatePatientInfo(data: any): Promise<void> {
    const id = data.id;
    delete data.id;
    await this.patientInfoEntity.update(id, data);
  }

  /**
   * 按证件号姓名查询 (与8081一致)
   */
  async getByIdCardAndName(idCard: string, name: string): Promise<any[]> {
    return await this.patientInfoEntity.find({
      where: { idCard, name, deletedAt: IsNull() },
    });
  }

  /**
   * 拉取某就诊人某问卷的答案（带题目 options 便于前端渲染）
   * 无记录返回 null
   */
  async getQuestionnaireAnswer(
    patientNo: string,
    questionnaireId: number,
    requestUserId?: number,
  ): Promise<any> {
    if (!patientNo || !questionnaireId) {
      throw new BizException('patientNo 和 questionnaireId 不能为空');
    }
    // 越权防御：仅允许查询自己 userId 下绑定过的档案
    if (requestUserId) {
      const owned = await this.patientUserEntity.findOne({
        where: { userId: requestUserId, patientNo },
      });
      if (!owned) {
        throw new BizException('该档案不在当前用户下，无权查看');
      }
    }

    const record = await this.questionnaireAnswerEntity.findOne({
      where: { patientNo, questionnaireId },
      order: { updatedAt: 'DESC' },
    });
    if (!record) return null;

    const rawAnswers: any[] = Array.isArray(record.answers?.answers) ? record.answers.answers : [];
    if (rawAnswers.length === 0) {
      return { id: record.id, questions: [] };
    }

    // 拉所有题目的 options，按 bh 拼回去
    const questions = await this.questionEntity.find({ where: { questionnaireId } });
    const questionIds = questions.map(q => q.id);
    const options = questionIds.length
      ? await this.optionEntity.find({ where: questionIds.map(id => ({ questionId: id })) })
      : [];
    const optionMap = new Map<number, OptionEntity[]>();
    for (const o of options) {
      const arr = optionMap.get(o.questionId) || [];
      arr.push(o);
      optionMap.set(o.questionId, arr);
    }
    const bhToQuestion = new Map<string, QuestionEntity>(questions.map(q => [String(q.bh), q]));

    const enriched = rawAnswers.map((a: any) => {
      const q = bhToQuestion.get(String(a.bh));
      const opts = q ? (optionMap.get(q.id) || []).map(o => ({
        content: o.content,
        sort: o.sort,
        option: o.bh,
        other: o.other,
      })) : [];
      return { ...a, options: opts };
    });

    return { id: record.id, questions: enriched };
  }

  /**
   * 提交/更新某就诊人某问卷答案（同 patientNo+questionnaireId 二次提交 = 更新）
   * 用 PG 原生 ON CONFLICT 兜底并发，配合 uq_questionnaire_answer_patient_q 唯一索引
   */
  async submitQuestionnaireAnswer(
    patientNo: string,
    questionnaireId: number,
    answers: any,
    requestUserId?: number,
  ): Promise<any> {
    if (!patientNo || !questionnaireId) {
      throw new BizException('patientNo 和 questionnaireId 不能为空');
    }
    if (requestUserId) {
      const owned = await this.patientUserEntity.findOne({
        where: { userId: requestUserId, patientNo },
      });
      if (!owned) {
        throw new BizException('该档案不在当前用户下，无权提交');
      }
    }

    // answers 形如 { answers: [...] }，与前端 finalJson 对齐
    const payload = answers && typeof answers === 'object' && Array.isArray(answers.answers)
      ? answers
      : { answers: Array.isArray(answers) ? answers : [] };

    // 先查一下，确认是 insert 还是 update（仅用于返回 updated 标记）
    const existing = await this.questionnaireAnswerEntity.findOne({
      where: { patientNo, questionnaireId },
    });

    // 原生 upsert：依赖 (patient_no, questionnaire_id) 唯一索引，并发安全
    await this.questionnaireAnswerEntity
      .createQueryBuilder()
      .insert()
      .into(QuestionnaireAnswerEntity)
      .values({ patientNo, questionnaireId, answers: payload })
      .orUpdate(['answers', 'updated_at'], ['patient_no', 'questionnaire_id'])
      .execute();

    // 再读一次拿 id
    const after = await this.questionnaireAnswerEntity.findOne({
      where: { patientNo, questionnaireId },
      select: ['id'],
    });
    return { id: after?.id, updated: !!existing };
  }

  // 内部方法
  private async updateDefaultByUserId(userId: number, defaultVal: number): Promise<void> {
    await this.patientUserEntity.update({ userId }, { default: defaultVal });
  }
}