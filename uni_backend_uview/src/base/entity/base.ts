import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * 基础实体
 */
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'createTime' })
  createTime: Date;

  @UpdateDateColumn({ name: 'updateTime' })
  updateTime: Date;
}