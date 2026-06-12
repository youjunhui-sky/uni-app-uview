import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { buildDatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PatientModule } from './modules/patient/patient.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';
import { EtiologyModule } from './modules/etiology/etiology.module';
import { DictModule } from './modules/dict/dict.module';
import { UploadModule } from './modules/upload/upload.module';
import { BaseModule } from './modules/base/base.module';
import { SmsModule } from './common/sms/sms.module';

@Module({
  imports: [
    // 数据库配置 - 详见 ./config/database.config.ts
    TypeOrmModule.forRootAsync({
      useFactory: () => buildDatabaseConfig(),
    }),

    // JWT 配置
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'uni-backend-secret-key-2024',
      signOptions: { expiresIn: '6h' },
    }),

    // 业务模块
    AuthModule,
    UserModule,
    PatientModule,
    QuestionnaireModule,
    EtiologyModule,
    DictModule,
    UploadModule,
    BaseModule,

    // 公共模块
    SmsModule,
  ],
})
export class AppModule {}
