import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsService } from './sms.service';
import { BaseSysParamEntity } from '../../entities/sys-param.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BaseSysParamEntity])],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}