import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EtiologyService } from './etiology.service';
import { Request } from 'express';

@Controller('app/etiology')
export class EtiologyController {
  constructor(private readonly etiologyService: EtiologyService) {}

  /**
   * 获取代谢评估列表
   * POST /app/etiology/muaInfo/getMuaInfoByPatientNo
   */
  @Post('muaInfo/getMuaInfoByPatientNo')
  @UseGuards(JwtAuthGuard)
  async getMuaInfoByPatientNo(@Body() body: { patientNo: string }, @Req() req: Request) {
    const user = req.user as any;
    return this.etiologyService.getMuaInfoByPatientNo(
      body.patientNo,
      user?.sub || user?.id,
    );
  }

  /**
   * 获取代谢评估详情
   * POST /app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo
   */
  @Post('muaInfo/getMuaContentByPatientNoAndSwlNo')
  @UseGuards(JwtAuthGuard)
  async getMuaContentByPatientNoAndSwlNo(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    return this.etiologyService.getMuaContentByPatientNoAndSwlNo({
      ...body,
      _requestUserId: user?.sub || user?.id,
    });
  }
}
