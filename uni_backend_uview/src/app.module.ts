import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

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
       // 数据库配置
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '36.111.159.23',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '1223',
      database: process.env.DB_NAME || 'herisdb',
      entities: [__dirname + '/entities/*.entity{.ts,.js}', __dirname + '/**/entities/*.entity{.ts,.js}'],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
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
