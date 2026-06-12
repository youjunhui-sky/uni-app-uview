import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwlRegister } from './entity/swl-info.entity';
import { SwlTreatment } from './entity/swl-treatment.entity';
import { SwlImagingExam } from './entity/swl-exam.entity';
import { PatientInfoEntity } from '../../../entities/patient-info.entity';
import { SwlRegisterController } from './controller/swl-register.controller';
import { SwlRegisterService } from './service/swl-register.service';
import { SwlTreatmentController } from './controller/swl-treatment.controller';
import { SwlTreatmentService } from './service/swl-treatment.service';
import { SwlImagingExamController } from './controller/swl-imaging-exam.controller';
import { SwlImagingExamService } from './service/swl-imaging-exam.service';

/**
 * SWL 诊疗模块（移动端）
 * 当前注册：register / treatment / imaging-exam
 * 后续按需添加：sqbl / followup / composition
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([SwlRegister, SwlTreatment, SwlImagingExam, PatientInfoEntity]),
  ],
  controllers: [
    SwlRegisterController,
    SwlTreatmentController,
    SwlImagingExamController,
  ],
  providers: [
    SwlRegisterService,
    SwlTreatmentService,
    SwlImagingExamService,
  ],
  exports: [
    SwlRegisterService,
    SwlTreatmentService,
    SwlImagingExamService,
  ],
})
export class SwlModule {}
