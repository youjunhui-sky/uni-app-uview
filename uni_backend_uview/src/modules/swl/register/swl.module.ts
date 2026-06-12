import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwlRegister } from './entity/swl-info.entity';
import { SwlTreatment } from './entity/swl-treatment.entity';
import { SwlImagingExam } from './entity/swl-exam.entity';
import { SwlCurrentHistory } from './entity/swl-current-history.entity';
import { SwlPastMedicalHistory } from './entity/swl-pastmedical.entity';
import { SwlFamilyHistory } from './entity/swl-family.entity';
import { SwlPastStoneHistory } from './entity/swl-paststone.entity';
import { SwlPersonalHistory } from './entity/swl-personal.entity';
import { SwlMenstrualMarriageHistory } from './entity/swl-menstrual.entity';
import { SwlVitalSigns } from './entity/swl-vital.entity';
import { SwlLabResultDetail } from './entity/swl-lab.entity';
import { SwlDiagnosis } from './entity/swl-diagnosis.entity';
import { SwlNearFollowup } from './entity/swl-near-followup.entity';
import { SwlFutureFollowup } from './entity/swl-future-followup.entity';
import { SwlCurative } from './entity/swl-curative.entity';
import { StoneComponentEntity } from './entity/swl-stone-component.entity';
import { PatientInfoEntity } from '../../../entities/patient-info.entity';

import { SwlRegisterController } from './controller/swl-register.controller';
import { SwlRegisterService } from './service/swl-register.service';
import { SwlTreatmentController } from './controller/swl-treatment.controller';
import { SwlTreatmentService } from './service/swl-treatment.service';
import { SwlImagingExamController } from './controller/swl-imaging-exam.controller';
import { SwlImagingExamService } from './service/swl-imaging-exam.service';
import {
  SwlCurrentHistoryController,
  SwlPastMedicalHistoryController,
  SwlFamilyHistoryController,
  SwlPastStoneHistoryController,
  SwlPersonalHistoryController,
  SwlMenstrualMarriageHistoryController,
  SwlVitalSignsController,
  SwlLabResultDetailController,
  SwlDiagnosisController,
} from './controller/history-controllers';
import {
  SwlCurrentHistoryService,
  SwlPastMedicalHistoryService,
  SwlFamilyHistoryService,
  SwlPastStoneHistoryService,
  SwlPersonalHistoryService,
  SwlMenstrualMarriageHistoryService,
  SwlVitalSignsService,
  SwlLabResultDetailService,
  SwlDiagnosisService,
} from './service/history-services';
import {
  SwlNearFollowupController,
  SwlFutureFollowupController,
  SwlCurativeController,
} from './controller/followup-controllers';
import {
  SwlNearFollowupService,
  SwlFutureFollowupService,
  SwlCurativeService,
} from './service/followup-services';
import { SwlStoneComponentController } from './controller/composition-controllers';
import { SwlStoneComponentService } from './service/composition-services';

/** SWL 诊疗模块（移动端）— 全功能版 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      SwlRegister,
      SwlTreatment,
      SwlImagingExam,
      SwlCurrentHistory,
      SwlPastMedicalHistory,
      SwlFamilyHistory,
      SwlPastStoneHistory,
      SwlPersonalHistory,
      SwlMenstrualMarriageHistory,
      SwlVitalSigns,
      SwlLabResultDetail,
      SwlDiagnosis,
      SwlNearFollowup,
      SwlFutureFollowup,
      SwlCurative,
      StoneComponentEntity,
      PatientInfoEntity,
    ]),
  ],
  controllers: [
    SwlRegisterController,
    SwlTreatmentController,
    SwlImagingExamController,
    SwlCurrentHistoryController,
    SwlPastMedicalHistoryController,
    SwlFamilyHistoryController,
    SwlPastStoneHistoryController,
    SwlPersonalHistoryController,
    SwlMenstrualMarriageHistoryController,
    SwlVitalSignsController,
    SwlLabResultDetailController,
    SwlDiagnosisController,
    SwlNearFollowupController,
    SwlFutureFollowupController,
    SwlCurativeController,
    SwlStoneComponentController,
  ],
  providers: [
    SwlRegisterService,
    SwlTreatmentService,
    SwlImagingExamService,
    SwlCurrentHistoryService,
    SwlPastMedicalHistoryService,
    SwlFamilyHistoryService,
    SwlPastStoneHistoryService,
    SwlPersonalHistoryService,
    SwlMenstrualMarriageHistoryService,
    SwlVitalSignsService,
    SwlLabResultDetailService,
    SwlDiagnosisService,
    SwlNearFollowupService,
    SwlFutureFollowupService,
    SwlCurativeService,
    SwlStoneComponentService,
  ],
  exports: [
    SwlRegisterService,
    SwlTreatmentService,
    SwlImagingExamService,
    SwlCurrentHistoryService,
    SwlPastMedicalHistoryService,
    SwlFamilyHistoryService,
    SwlPastStoneHistoryService,
    SwlPersonalHistoryService,
    SwlMenstrualMarriageHistoryService,
    SwlVitalSignsService,
    SwlLabResultDetailService,
    SwlDiagnosisService,
    SwlNearFollowupService,
    SwlFutureFollowupService,
    SwlCurativeService,
    SwlStoneComponentService,
  ],
})
export class SwlModule {}
