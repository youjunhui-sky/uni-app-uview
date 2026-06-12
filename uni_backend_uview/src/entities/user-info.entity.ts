import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 用户信息实体（对齐 mdp 库 base.tuser_info）
 * 注：tuser_info 在 mdp 中不存在，对应 DDL 见 mdp-diff.md 第六节
 */
@Entity({
  name: 'tuser_info',
  schema: 'base',
  comment: '用户信息',
})
export class UserInfoEntity {
  @PrimaryGeneratedColumn({ comment: '主键' })
  id: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', comment: '更新时间' })
  updatedAt: Date;

  @Column({ name: 'org_id', type: 'uuid', nullable: true, comment: '组织ID' })
  orgId: string;

  @Index({ unique: true })
  @Column({ comment: '登录唯一ID', nullable: true })
  unionid: string;

  @Column({ name: 'avatarUrl', comment: '头像', nullable: true })
  avatarUrl: string;

  @Column({ name: 'nickName', comment: '昵称', nullable: true })
  nickName: string;

  @Index({ unique: true })
  @Column({ comment: '手机号', nullable: true })
  phone: string;

  @Column({ comment: '性别', type: 'smallint', default: 0 })
  gender: number;

  @Column({ comment: '状态', type: 'smallint', default: 1 })
  status: number;

  @Column({ name: 'loginType', comment: '登录方式', type: 'smallint', default: 0 })
  loginType: number;

  @Column({ comment: '密码', nullable: true })
  password: string;

  @Column({ comment: '介绍', type: 'text', nullable: true })
  description: string;
}
