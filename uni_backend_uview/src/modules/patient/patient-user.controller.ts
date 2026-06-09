import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PatientService } from './patient.service';
import { Request } from 'express';

@Controller('app/patient/patientUser')
export class PatientUserController {
  constructor(private readonly patientService: PatientService) {}

  /**
   * 获取用户就诊人列表 (与8081一致)
   * POST /app/patient/patientUser/getByUserId
   */
  @Post('getByUserId')
  @UseGuards(JwtAuthGuard)
  async getByUserId(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    const userId = body.userId || user?.sub || user?.id;
    return this.patientService.getByUserId(parseInt(userId));
  }

  /**
   * 获取当前就诊人 (与8081一致)
   * POST /app/patient/patientUser/getCurrentPatient
   */
  @Post('getCurrentPatient')
  @UseGuards(JwtAuthGuard)
  async getCurrentPatient(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    const userId = body.userId || user?.sub || user?.id;
    return this.patientService.getCurrentPatient(parseInt(userId));
  }

  /**
   * 按用户ID和档案号查询 (与8081一致)
   * POST /app/patient/patientUser/getByUserIdAndPatientNo
   */
  @Post('getByUserIdAndPatientNo')
  @UseGuards(JwtAuthGuard)
  async getByUserIdAndPatientNo(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    const userId = body.userId || user?.sub || user?.id;
    return this.patientService.getByUserIdAndPatientNo({
      userId: parseInt(userId),
      patientNo: body.patientNo,
    });
  }

  /**
   * 添加就诊人 (与8081一致)
   * POST /app/patient/patientUser/addPatientUser
   */
  @Post('addPatientUser')
  @UseGuards(JwtAuthGuard)
  async addPatientUser(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    body.userId = body.userId || user?.sub || user?.id;
    return this.patientService.addPatientUser(body);
  }

  /**
   * 设置默认就诊人 (与8081一致)
   * POST /app/patient/patientUser/updateDefault
   */
  @Post('updateDefault')
  @UseGuards(JwtAuthGuard)
  async updateDefault(@Body() body: any, @Req() req: Request) {
    const user = req.user as any;
    body.userId = body.userId || user?.sub || user?.id;
    return this.patientService.updateDefault(body);
  }

  /**
   * 删除就诊人 (与8081一致)
   * POST /app/patient/patientUser/delete
   * 入参: { ids: string[] }  档案关联 id 列表
   */
  @Post('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Body() body: { ids: string[] }) {
    const ids = (body.ids || []).map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (ids.length === 0) {
      return { code: 400, message: 'ids 不能为空' };
    }
    return this.patientService.deletePatientUser(ids);
  }
}