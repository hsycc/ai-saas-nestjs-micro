import { registerAs } from '@nestjs/config';

export const MysqlBase = registerAs('MysqlBase', () => ({
  type: process.env.DB_TYPE,
  charset: process.env.DB_CHARSER,
  multipleStatements: true,
  dropSchema: false,
  synchronize: true,
  cache: process.env.DB_CACHEABLE,
  // logging: 'all',
  logging: false,
  logger: process.env.DB_LOGGER,
}));