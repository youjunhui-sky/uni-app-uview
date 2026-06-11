/**
 * 阿里云短信服务配置模板
 * 复制此文件为 sms.config.ts 并填入真实值
 */
export const smsConfig = {
  /** 阿里云 AccessKeyId */
  accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID || '',

  /** 阿里云 AccessKeySecret */
  accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET || '',

  /** 短信签名 */
  signName: process.env.ALIBABA_CLOUD_SMS_SIGN_NAME || '',

  /** 短信模板编码 (模板需包含 ${code} 变量) */
  templateCode: process.env.ALIBABA_CLOUD_SMS_TEMPLATE_CODE || '',
};