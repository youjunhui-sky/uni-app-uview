import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserInfoEntity } from '../../entities/user-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { JwtStrategy } from '../../common/guards/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfoEntity, PatientUserEntity, PatientInfoEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'uni-backend-secret-key-2024',
      signOptions: { expiresIn: '6h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, JwtStrategy],
})
export class AuthModule {}