import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientUserController } from './patient-user.controller';
import { PatientInfoController } from './patient-info.controller';
import { QuestionnaireAnswerController } from './questionnaire-answer.controller';
import { PatientService } from './patient.service';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { QuestionnaireAnswerEntity } from '../../entities/questionnaire-answer.entity';
import { QuestionEntity } from '../../entities/question.entity';
import { OptionEntity } from '../../entities/option.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PatientInfoEntity,
      PatientUserEntity,
      QuestionnaireAnswerEntity,
      QuestionEntity,
      OptionEntity,
    ]),
    AuthModule,
  ],
  controllers: [PatientUserController, PatientInfoController, QuestionnaireAnswerController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}