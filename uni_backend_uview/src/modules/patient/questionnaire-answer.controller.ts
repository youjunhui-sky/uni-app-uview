import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PatientService } from './patient.service';
import { Request } from 'express';

@Controller('app/patient/questionnaire')
export class QuestionnaireAnswerController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * 拉取某就诊人某问卷的最新答案
   * POST /app/patient/questionnaire/getAnswer
   * body: { patientNo, questionnaireId }
   * 若无记录返回 null
   */
  @Post('getAnswer')
  @UseGuards(JwtAuthGuard)
  async getAnswer(@Body() body: { patientNo: string; questionnaireId: number }, @Req() req: Request) {
    const user = req.user as any;
    return this.patientService.getQuestionnaireAnswer(
      body.patientNo,
      Number(body.questionnaireId),
      user?.sub || user?.id,
    );
  }

  /**
   * 提交/更新某就诊人某问卷答案（同 patientNo+questionnaireId 二次提交 = 更新）
   * POST /app/patient/questionnaire/submitAnswer
   * body: { patientNo, questionnaireId, answers: [{ bh, value, option, other }] }
   */
  @Post('submitAnswer')
  @UseGuards(JwtAuthGuard)
  async submitAnswer(@Body() body: { patientNo: string; questionnaireId: number; answers: any }, @Req() req: Request) {
    const user = req.user as any;
    return this.patientService.submitQuestionnaireAnswer(
      body.patientNo,
      Number(body.questionnaireId),
      body.answers,
      user?.sub || user?.id,
    );
  }
}
