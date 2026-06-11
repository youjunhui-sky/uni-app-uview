import { Injectable, Logger } from '@nestjs/common';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { smsConfig } from '../../config/sms.config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: Dysmsapi20170525 | null = null;

  constructor() {
    const { accessKeyId, accessKeySecret } = smsConfig;

    if (!accessKeyId || !accessKeySecret) {
      this.logger.warn(
        '阿里云短信服务未配置: 缺少 accessKeyId 或 accessKeySecret，短信发送将使用模拟模式',
      );
      return;
    }

    const config = new $OpenApi.Config({
      accessKeyId,
      accessKeySecret,
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    this.client = new Dysmsapi20170525(config);
  }

  /**
   * 发送短信验证码
   * @param phone 手机号
   * @param code 验证码
   * @param signName 短信签名（可选，默认从配置文件 smsConfig 读取）
   * @param templateCode 短信模板编码（可选，默认从配置文件 smsConfig 读取）
   */
  async sendSmsCode(
    phone: string,
    code: string,
    signName?: string,
    templateCode?: string,
  ): Promise<{ success: boolean; bizId?: string; message?: string }> {
    const resolvedSignName = signName || smsConfig.signName;
    const resolvedTemplateCode = templateCode || smsConfig.templateCode;

    if (!this.client) {
      // 未配置阿里云服务，使用模拟模式
      this.logger.log(
        `[模拟发送] 手机号: ${phone}, 验证码: ${code}, 签名: ${resolvedSignName || '未设置'}, 模板: ${resolvedTemplateCode || '未设置'}`,
      );
      return { success: true, message: '模拟发送成功' };
    }

    if (!resolvedSignName) {
      throw new Error('短信签名未配置，请在 src/config/sms.config.ts 中设置 signName');
    }
    if (!resolvedTemplateCode) {
      throw new Error('短信模板未配置，请在 src/config/sms.config.ts 中设置 templateCode');
    }

    try {
      const sendReq = new $Dysmsapi20170525.SendSmsRequest({
        signName: resolvedSignName,
        templateCode: resolvedTemplateCode,
        phoneNumbers: phone,
        templateParam: JSON.stringify({ code }),
      });

      const result = await this.client.sendSms(sendReq);
      const response = result.body;

      this.logger.log(
        `短信发送结果: 手机号=${phone}, Code=${response.code}, Message=${response.message}, BizId=${response.bizId}`,
      );

      if (response.code !== 'OK') {
        this.logger.error(`短信发送失败: ${response.message}`);
        return {
          success: false,
          message: response.message || '短信发送失败',
        };
      }

      return {
        success: true,
        bizId: response.bizId,
      };
    } catch (error: any) {
      this.logger.error(`短信发送异常: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || '短信发送异常',
      };
    }
  }
}