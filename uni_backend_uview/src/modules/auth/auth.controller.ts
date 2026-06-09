import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('app/user/login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 手机号+验证码登录 (与8081一致)
   * POST /app/user/login/phone
   */
  @Post('phone')
  async phoneLogin(@Body() body: { phone: string; smsCode: string }) {
    return this.authService.phoneLogin(body.phone, body.smsCode);
  }

  /**
   * 发送短信验证码 (与8081一致)
   * POST /app/user/login/smsCode
   */
  @Post('smsCode')
  async sendSmsCode(@Body() body: { phone: string; captchaId: string; code: string }) {
    return this.authService.sendSmsCode(body.phone, body.captchaId, body.code);
  }

  /**
   * 获取图形验证码 (与8081一致)
   * GET /app/user/login/captcha
   */
  @Get('captcha')
  async getCaptcha(@Query() query: { width?: number; height?: number; color?: string }) {
    return this.authService.getCaptcha(
      query.width || 150,
      query.height || 50,
      query.color || '#fff'
    );
  }

  /**
   * 刷新Token (与8081一致)
   * POST /app/user/login/refreshToken
   */
  @Post('refreshToken')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}