import { Controller, Post, Get, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.upload(file);
  }
}