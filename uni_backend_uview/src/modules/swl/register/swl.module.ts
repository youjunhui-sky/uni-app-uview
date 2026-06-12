import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwlRegister } from './entity/swl-info.entity';
import { PatientInfoEntity } from '../../../entities/patient-info.entity';
import { SwlRegisterController } from './controller/swl-register.controller';
import { SwlRegisterService } from './service/swl-register.service';

/**
 * SWL 诊疗模块（移动端）
 * 当前仅注册列表与详情接口，其他功能按需补充
 */
@Module({
  imports: [TypeOrmModule.forFeature([SwlRegister, PatientInfoEntity])],
  controllers: [SwlRegisterController],
  providers: [SwlRegisterService],
  exports: [SwlRegisterService],
})
export class SwlModule {}
