import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../../../common/guards/jwt-auth.guard';
import { SwlRegisterService } from '../service/swl-register.service';
import { GetSwlByPatientNoDto } from '../dto/swl-register.dto';

/**
 * SWL 就诊登记接口（移动端）
 * 路由前缀：/app/swl/register
 */
@Controller('app/swl/register')
@UseGuards(JwtAuthGuard)
export class SwlRegisterController {
  constructor(private readonly swlRegisterService: SwlRegisterService) {}

  /**
   * 根据档案号查询 SWL 诊疗记录列表
   * POST /app/swl/register/getByPatientNo
   * Body: { patientNo: string }
   */
  @Post('getByPatientNo')
  async getByPatientNo(@Body() body: GetSwlByPatientNoDto, @Req() req: Request) {
    const user = req.user as any;
    return this.swlRegisterService.getByPatientNo(
      body.patientNo,
      user?.sub || user?.id,
    );
  }

  /**
   * 根据主键查询 SWL 诊疗详情
   * GET /app/swl/register/:id
   */
  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.swlRegisterService.getById(id);
  }
}
