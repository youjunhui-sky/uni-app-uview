import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Dysmsapi20170525, * as $Dysmsapi20170525 from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import { BaseSysParamEntity } from '../../entities/sys-param.entity';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: Dysmsapi20170525 | null = null;
  private clientInited = false;

  constructor(
    @InjectRepository(BaseSysParamEntity)
    private readonly baseSysParamEntity: Repository<BaseSysParamEntity>,
  ) {}

  /**
   * 根据 keyName 获取系统参数值（与8081的 baseSysParamService.dataByKey 一致）
   */
  private async dataByKey(key: string): Promise<string> {
    const entity = await this.baseSysParamEntity.findOneBy({ keyName: key });
    return entity?.data || '';
  }

  /**
   * 初始化阿里云 SMS 客户端（从数据库读取凭证）
   */
  private async initClient(): Promise<void> {
    if (this.clientInited) return;
    this.clientInited = true;

    const accessKeyId = await this.dataByKey('smsAccessKeyId');
    const accessKeySecret = await this.dataByKey('smsAccessKeySecret');

    if (!accessKeyId || !accessKeySecret) {
      this.logger.warn(
        '阿里云短信服务未配置: 缺少 smsAccessKeyId 或 smsAccessKeySecret，短信发送将使用模拟模式',
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
   */
  async sendSmsCode(phone: string, code: string): Promise<{ success: boolean; bizId?: string; message?: string }> {
    await this.initClient();

    const signName = await this.dataByKey('smsSignName');
    const templateCode = await this.dataByKey('smsVerifiTemplate');

    if (!this.client) {
      // 未配置阿里云服务，使用模拟模式
      this.logger.log(
        `[模拟发送] 手机号: ${phone}, 验证码: ${code}, 签名: ${signName || '未设置'}, 模板: ${templateCode || '未设置'}`,
      );
      return { success: true, message: '模拟发送成功' };
    }

    if (!signName) {
      throw new Error('短信签名未配置，请在 base_sys_param 表中配置 keyName=smsSignName');
    }
    if (!templateCode) {
      throw new Error('短信模板未配置，请在 base_sys_param 表中配置 keyName=smsVerifiTemplate');
    }

    try {
      const sendReq = new $Dysmsapi20170525.SendSmsRequest({
        signName,
        templateCode,
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