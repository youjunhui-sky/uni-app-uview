import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../base/entity/base';

/**
 * 用户信息
 */
@Entity({
  name: 'user_info',
  comment: '用户信息',
})
export class UserInfoEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '登录唯一ID', nullable: true })
  unionid: string;

  @Column({ comment: '头像', nullable: true })
  avatarUrl: string;

  @Column({ comment: '昵称', nullable: true })
  nickName: string;

  @Index({ unique: true })
  @Column({ comment: '手机号', nullable: true })
  phone: string;

  @Column({ comment: '性别', default: 0 })
  gender: number;

  @Column({ comment: '状态', default: 1 })
  status: number;

  @Column({ comment: '登录方式', default: 0 })
  loginType: number;

  @Column({ comment: '密码', nullable: true })
  password: string;

  @Column({ comment: '介绍', type: 'text', nullable: true })
  description: string;
}