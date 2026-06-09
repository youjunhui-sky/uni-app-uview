/**
 * Cool-Admin 通用异常类
 */
export class CoolCommException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoolCommException';
  }
}