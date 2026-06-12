import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'uni-backend-secret-key-2024',
    });
  }

  async validate(payload: any) {
    // TODO 冒烟测试临时日志：smoke test will revert
    console.log(`[smoke-test] JwtStrategy.validate payload=${JSON.stringify(payload)}`);
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Token无效');
    }
    return { sub: payload.sub, id: payload.sub, phone: payload.phone };
  }
}