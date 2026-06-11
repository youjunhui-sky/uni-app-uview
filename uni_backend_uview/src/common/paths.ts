import * as path from 'path';

/**
 * 本地上传目录与静态资源 URL 前缀的单一来源。
 * main.ts（useStaticAssets）与 UploadController / UploadService 全部从这里 import，
 * 避免 process.cwd() 漂移或字面量重复导致上传写入路径与 URL 解析路径错位。
 */

/** 磁盘上的文件根目录 */
export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

/** 对外暴露的 URL 前缀（不含尾斜杠） */
export const UPLOAD_PREFIX = '/uploads';
