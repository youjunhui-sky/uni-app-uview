import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';
import { BaseSysParamEntity } from '../../entities/sys-param.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BaseSysParamEntity]), AuthModule],
  controllers: [BaseController],
  providers: [BaseService],
  exports: [BaseService],
})
export class BaseModule {}