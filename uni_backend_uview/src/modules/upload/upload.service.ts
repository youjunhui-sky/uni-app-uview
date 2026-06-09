import { Injectable } from '@nestjs/common';

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
   * 上传文件
   */
  async upload(data: any): Promise<{ url: string }> {
    // TODO: 实现文件上传逻辑
    return {
      url: 'https://example.com/uploads/mock-file.png',
    };
  }
}
