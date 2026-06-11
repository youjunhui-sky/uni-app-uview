import { Controller, Post, Get, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UploadService } from './upload.service';
import { UPLOAD_DIR } from '../../common/paths';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as fs from 'fs';
import * as multer from 'multer';

/** 允许的扩展名（小写），覆盖 getUploadMode 宣传的 MIME 类型 */
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.mp4'];

/** 单文件大小上限 */
const MAX_SIZE = 10 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // recursive: true 已幂等，无需 existsSync 预检
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname || '').toLowerCase();
    cb(null, `${uuid()}${ext}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = extname(file.originalname || '').toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    return cb(new BadRequestException(`不支持的文件类型: ${ext || '空'}`));
  }
  cb(null, true);
};

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
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: { fileSize: MAX_SIZE },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('未收到文件');
    }
    return this.uploadService.upload(file);
  }
}
