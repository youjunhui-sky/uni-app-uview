import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { EtiologyService } from './etiology.service';

@Controller('app/etiology')
export class EtiologyController {
  constructor(private readonly etiologyService: EtiologyService) {}

  /**
   * 获取代谢评估列表
   * POST /app/etiology/muaInfo/getMuaInfoByPatientNo
   */
  @Post('muaInfo/getMuaInfoByPatientNo')
  @UseGuards(JwtAuthGuard)
  async getMuaInfoByPatientNo(@Body() body: { patientNo: string }) {
    return this.etiologyService.getMuaInfoByPatientNo(body.patientNo);
  }

  /**
   * 获取代谢评估详情
   * POST /app/etiology/muaInfo/getMuaContentByPatientNoAndSwlNo
   */
  @Post('muaInfo/getMuaContentByPatientNoAndSwlNo')
  @UseGuards(JwtAuthGuard)
  async getMuaContentByPatientNoAndSwlNo(@Body() body: any) {
    return this.etiologyService.getMuaContentByPatientNoAndSwlNo(body);
  }
}
