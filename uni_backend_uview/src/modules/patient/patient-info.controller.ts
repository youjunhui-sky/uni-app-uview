import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PatientService } from './patient.service';
import { PageDto } from '../../common/dto/page.dto';

@Controller('app/patient')
export class PatientInfoController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * 分页查询患者 (与8081一致)
   * POST /app/patient/info/page
   */
  @Post('info/page')
  @UseGuards(JwtAuthGuard)
  async page(@Body() body: PageDto) {
    return this.patientService.pagePatient(body);
  }

  /**
   * 获取患者详情 (与8081一致)
   * GET /app/patient/info/info?id=xxx
   */
  @Get('info/info')
  @UseGuards(JwtAuthGuard)
  async info(@Query() query: { id: string }) {
    return this.patientService.getPatientInfo(query.id);
  }

  /**
   * 更新患者信息 (与8081一致)
   * POST /app/patient/patientInfo/update
   */
  @Post('patientInfo/update')
  @UseGuards(JwtAuthGuard)
  async update(@Body() body: any) {
    return this.patientService.updatePatientInfo(body);
  }

  /**
   * 按证件号姓名查询 (与8081一致)
   * POST /app/patient/patientInfo/getByIdCardAndName
   */
  @Post('patientInfo/getByIdCardAndName')
  @UseGuards(JwtAuthGuard)
  async getByIdCardAndName(@Body() body: { idCard: string; name: string }) {
    return this.patientService.getByIdCardAndName(body.idCard, body.name);
  }
}