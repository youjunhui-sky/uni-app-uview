import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserInfoEntity } from '../../entities/user-info.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private readonly userInfoEntity: Repository<UserInfoEntity>,
  ) {}

  /**
   * 获取当前用户信息 (与8081一致)
   */
  async getPerson(userId: number): Promise<any> {
    const user = await this.userInfoEntity.findOneBy({ id: userId });
    if (user) {
      return {
        id: user.id,
        phone: user.phone,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        gender: user.gender,
        loginType: user.loginType,
        status: user.status,
      };
    }
    return null;
  }

  /**
   * 更新用户信息 (与8081一致)
   */
  async updatePerson(userId: number, data: any): Promise<void> {
    const updateData: any = { id: userId };
    if (data.nickName) updateData.nickName = data.nickName;
    if (data.avatarUrl) updateData.avatarUrl = data.avatarUrl;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.description) updateData.description = data.description;

    await this.userInfoEntity.update({ id: userId }, updateData);
  }

  /**
   * 获取微信配置
   */
  async getWxMpConfig(): Promise<any> {
    // TODO: 返回实际的微信配置
    return {
      appId: 'wx348f72db1512fa2e',
      timestamp: Math.floor(Date.now() / 1000),
      nonceStr: 'mock-nonce-str',
      signature: 'mock-signature',
    };
  }
}