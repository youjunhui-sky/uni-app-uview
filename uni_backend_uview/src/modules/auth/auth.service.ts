import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as svgCaptcha from 'svg-captcha';
import { v4 as uuid } from 'uuid';
import { UserInfoEntity } from '../../entities/user-info.entity';
import { PatientUserEntity } from '../../entities/patient-user.entity';
import { PatientInfoEntity } from '../../entities/patient-info.entity';
import { BizException } from '../../common/exceptions';
import { SmsService } from '../../common/sms/sms.service';

// 简单的内存缓存实现（与8081的midwayCache行为一致）
interface CacheEntry {
  value: any;
  expireTime: number;
}
const captchaCache = new Map<string, CacheEntry>();
const smsCache = new Map<string, CacheEntry>();

function cleanExpiredCache(cache: Map<string, CacheEntry>) {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (entry.expireTime < now) {
      cache.delete(key);
    }
  }
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoEntity: Repository<UserInfoEntity>,
    @InjectRepository(PatientUserEntity)
    private readonly patientUserEntity: Repository<PatientUserEntity>,
    @InjectRepository(PatientInfoEntity)
    private readonly patientInfoEntity: Repository<PatientInfoEntity>,
  ) { }

  /**
   * 手机号+验证码登录 (与8081一致)
   */
  async phoneLogin(phone: string, smsCode: string): Promise<any> {
    // 1、检查短信验证码
    const check = this.checkSmsCode(phone, smsCode);
    if (!check) {
      throw new BizException('验证码错误');
    }

    // 2、查询或创建用户
    let user: any = await this.userInfoEntity.findOneBy({ phone });

    if (!user) {
      user = {
        phone,
        unionid: phone,
        loginType: 2,
        nickName: phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2'),
      };
      await this.userInfoEntity.insert(user);
      user = await this.userInfoEntity.findOneBy({ phone });
    }

    // 3、获取就诊人信息 (与8081一致)
    const currentPatient = await this.getByUserId(user.id);

    // 4、生成token
    const token = this.generateToken({ id: user.id });
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      token,
      expire: 21600,
      refreshToken,
      refreshExpire: 43200,
      userInfo: {
        id: user.id,
        phone: user.phone,
        nickName: user.nickName,
        loginType: user.loginType,
        status: user.status,
        gender: user.gender,
        currentPatient: currentPatient.find((item) => item.default === 1),
        patients: currentPatient,
      },
    };
  }

  /**
   * 获取用户就诊人列表 (与8081一致)
   */
  private async getByUserId(userId: number): Promise<any[]> {
    const queryBuilder = this.patientUserEntity
      .createQueryBuilder('a')
      .select([
        'a.id as "id"',
        'a.patient_no as "patientNo"',
        'a.user_id as "userId"',
        'a.default as "default"',
        'b.name as "name"',
        'b.id_card as "idCard"',
        'b.gender as "gender"',
        'b.mobile as "mobile"',
        'b.occupation as "occupation"',
        'b.id as "patientId"',
      ])
      .leftJoin(
        PatientInfoEntity,
        'b',
        'a.patient_no = b.patient_no'
      );

    queryBuilder.andWhere('a.user_id = :userId', { userId: userId });
    return await queryBuilder.getRawMany();
  }

  /**
   * 发送短信验证码 (与8081一致)
   * 需要先校验图形验证码 captchaCheck
   */
  async sendSmsCode(phone: string, captchaId: string, code: string): Promise<any> {
    // 1、检查图片验证码
    const check = this.captchaCheck(captchaId, code);
    if (!check) {
      throw new BizException('图片验证码错误');
    }

    // 2、生成短信验证码（随机4位）
    const smsCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 3、通过阿里云短信服务发送验证码
    const result = await this.smsService.sendSmsCode(phone, smsCode);
    if (!result.success) {
      throw new BizException(result.message || '短信发送失败，请稍后重试');
    }

    // 4、缓存短信验证码（5分钟过期）
    cleanExpiredCache(smsCache);
    smsCache.set(`sms:${phone}`, {
      value: smsCode,
      expireTime: Date.now() + 5 * 60 * 1000,
    });

    return { success: true, bizId: result.bizId };
  }

  /**
   * 获取图形验证码 (与8081一致)
   */
  async getCaptcha(width = 150, height = 50, color = '#fff'): Promise<any> {
    const svg = svgCaptcha.create({
      width,
      height,
      noise: 3,
      background: '#f0f0f0', // 添加浅灰色背景，确保文字可见
    });

    const result: any = {
      captchaId: uuid(),
      data: svg.data.replace(/"/g, "'"),
    };

    // 转为 base64
    const base64Data = Buffer.from(result.data).toString('base64');
    result.data = `data:image/svg+xml;base64,${base64Data}`;

    // 半小时过期 (与8081一致)
    cleanExpiredCache(captchaCache);
    captchaCache.set(`verify:img:${result.captchaId}`, {
      value: svg.text.toLowerCase(),
      expireTime: Date.now() + 1800 * 1000,
    });

    // TODO 冒烟测试临时日志：smoke test will revert
    console.log(`[smoke-test] captchaId=${result.captchaId}, captchaText=${svg.text.toLowerCase()}`);

    return result;
  }

  /**
   * 刷新Token (与8081一致)
   */
  async refreshToken(refreshToken: string): Promise<any> {
    try {
      const info = this.jwtService.verify(refreshToken);
      if (!info['isRefresh']) {
        throw new BizException('token类型非refreshToken');
      }

      const userInfo = await this.userInfoEntity.findOneBy({ id: info['sub'] });
      if (!userInfo) {
        throw new BizException('用户不存在');
      }

      return this.token({ id: userInfo.id });
    } catch (error) {
      throw new UnauthorizedException('Token已过期，请重新登录');
    }
  }

  /**
   * 检验图片验证码
   */
  captchaCheck(captchaId: string, value: string): boolean {
    const rv = captchaCache.get(`verify:img:${captchaId}`);
    if (!rv || !value || value.toLowerCase() !== rv.value) {
      return false;
    }
    // 验证成功后删除
    captchaCache.delete(`verify:img:${captchaId}`);
    return true;
  }

  /**
   *检验短信验证码
   */
  private checkSmsCode(phone: string, code: string): boolean {
    const rv = smsCache.get(`sms:${phone}`);
    if (code && rv && rv.value === code) {
      return true;
    }
    return false;
  }

  /**
   * 生成token和refreshToken
   */
  private token(info: { id: number }) {
    const token = this.generateToken(info);
    const refreshToken = this.generateRefreshToken(info);
    return {
      expire: 21600,
      token,
      refreshExpire: 43200,
      refreshToken,
    };
  }

  private generateToken(info: any): string {
    return this.jwtService.sign({
      sub: info.id,
      id: info.id,
      isRefresh: false,
    });
  }

  private generateRefreshToken(info: any): string {
    return this.jwtService.sign(
      { sub: info.id, id: info.id, isRefresh: true },
      { expiresIn: '12h' },
    );
  }
}