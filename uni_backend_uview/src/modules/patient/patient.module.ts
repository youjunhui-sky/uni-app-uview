import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientUserController } from './patient-user.controller';
import { PatientInfoController } from './patient-info.controller';
import { PatientService } from './patient.service';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientInfoEntity, PatientUserEntity]), AuthModule],
  controllers: [PatientUserController, PatientInfoController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}