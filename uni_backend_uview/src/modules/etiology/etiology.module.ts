import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtiologyController } from './etiology.controller';
import { EtiologyService } from './etiology.service';
import { MuaInfoEntity } from '../../entities/mua-info.entity';
import { MuaContentEntity } from '../../entities/mua-content.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MuaInfoEntity, MuaContentEntity, PatientUserEntity]), AuthModule],
  controllers: [EtiologyController],
  providers: [EtiologyService],
  exports: [EtiologyService],
})
export class EtiologyModule {}