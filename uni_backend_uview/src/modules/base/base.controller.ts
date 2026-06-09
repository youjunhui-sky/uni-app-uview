import { Controller, Get, Query, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { BaseService } from './base.service';

@Controller('app/base/comm')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  /**
   * 获取协议/文档内容
   * GET /app/base/comm/param?key=userAgreement
   */
  @Get('param')
  async getParam(@Query('key') key: string, @Res() res: Response) {
    const result = await this.baseService.getParam(key);
    return res.status(200).json({
      code: 1000,
      data: result,
      message: 'success',
    });
  }

  /**
   * 获取 EPS 服务定义
   * GET /app/base/comm/eps
   * 直接返回原始格式，不经过任何拦截器
   */
  @Get('eps')
  async getEps(@Res() res: Response) {
    const eps = await this.baseService.getEps();
    // 直接返回，不包装 {code, data, message}
    return res.status(200).json(eps);
  }
}
