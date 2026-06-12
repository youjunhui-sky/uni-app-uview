import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * 数据库 (TypeORM) 配置的单一来源。
 * 通过 TypeOrmModule.forRootAsync 加载，连接信息全部走环境变量，
 * 本地开发可在项目根目录新建 .env 覆盖默认值，运维部署时通过环境注入。
 *
 * 实体扫描路径：
 *   - src/entities/*.entity(.ts|.js)        公共实体
 *   - src/**\/entities/*.entity(.ts|.js)    业务模块下的实体
 * 新增实体无需修改本文件，路径模式已覆盖。
 */
export const buildDatabaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || '36.111.159.23',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1223',
  database: process.env.DB_NAME || 'herisdb',
  entities: [
    __dirname + '/../entities/*.entity{.ts,.js}',
    __dirname + '/../**/entities/*.entity{.ts,.js}',
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
