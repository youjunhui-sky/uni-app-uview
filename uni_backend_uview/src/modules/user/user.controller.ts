import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller('app/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前用户信息 (与8081一致)
   * GET /app/user/info/person
   */
  @Get('info/person')
  @UseGuards(JwtAuthGuard)
  async getPerson(@Req() req: Request) {
    const user = req.user as any;
    return this.userService.getPerson(user?.sub || user?.id);
  }

  /**
   * 更新用户信息 (与8081一致)
   * POST /app/user/info/updatePerson
   */
  @Post('info/updatePerson')
  @UseGuards(JwtAuthGuard)
  async updatePerson(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    return this.userService.updatePerson(user?.sub || user?.id, body);
  }

  /**
   * 微信配置
   * GET /app/user/comm/wxMpConfig
   */
  @Get('comm/wxMpConfig')
  async getWxMpConfig() {
    return this.userService.getWxMpConfig();
  }
}