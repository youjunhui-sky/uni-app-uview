import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { QuestionnaireService } from './questionnaire.service';

@Controller('app/questionnaire')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  /**
   * 获取问卷题目（含选项）(与8081一致)
   * POST /app/questionnaire/questionnaire/questionsWithOptions
   */
  @Post('questionnaire/questionsWithOptions')
  @UseGuards(JwtAuthGuard)
  async questionsWithOptions(@Body() body: { questionnaireId?: number }) {
    return this.questionnaireService.getQuestionsWithOptions(body.questionnaireId);
  }
}