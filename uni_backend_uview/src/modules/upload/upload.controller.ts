import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';

@Controller('app/base/comm')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 获取上传模式
   * GET /app/base/comm/uploadMode
   */
  @Get('uploadMode')
  async getUploadMode() {
    return this.uploadService.getUploadMode();
  }

  /**
   * 上传文件
   * POST /app/base/comm/upload
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  async upload(@Body() body: any) {
    return this.uploadService.upload(body);
  }
}
