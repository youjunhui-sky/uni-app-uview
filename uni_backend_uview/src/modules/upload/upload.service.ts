import { Injectable } from '@nestjs/common';
import { UPLOAD_PREFIX } from '../../common/paths';

@Injectable()
export class UploadService {
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
   * 由 multer.diskStorage 直接写入 uploads/ 后，file.filename 即上传后的文件名
   */
  async upload(file: Express.Multer.File): Promise<{ url: string; name: string; size: number }> {
    return {
      url: `${UPLOAD_PREFIX}/${file.filename}`,
      name: file.filename,
      size: file.size,
    };
  }
}
