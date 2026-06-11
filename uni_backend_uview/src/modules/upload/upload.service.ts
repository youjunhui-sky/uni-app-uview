import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  /** 本地存储根目录 */
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  /** URL 访问前缀（前端拼上 baseUrl 即可访问） */
  private readonly urlPrefix = '/uploads';

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * 获取上传模式
   */
  async getUploadMode(): Promise<{ mode: string; config: any }> {
    return {
      mode: 'local',
      config: {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
      },
    };
  }

  /**
   * 上传文件到本地
   * @param file multer 解析后的文件
   */
  async upload(file: Express.Multer.File): Promise<{ url: string; name: string; size: number }> {
    if (!file) {
      throw new BadRequestException('未收到文件');
    }

    const ext = path.extname(file.originalname) || '';
    const fileName = `${uuid()}${ext}`;
    const destPath = path.join(this.uploadDir, fileName);

    // multer 默认会写到临时目录，这里移动到 uploads/
    fs.renameSync(file.path, destPath);

    return {
      url: `${this.urlPrefix}/${fileName}`,
      name: fileName,
      size: file.size,
    };
  }
}