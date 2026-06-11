/**
 * 业务异常类
 */
export class BizException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BizException';
  }
}