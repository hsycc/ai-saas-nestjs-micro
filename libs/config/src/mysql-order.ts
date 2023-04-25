import { registerAs } from '@nestjs/config';
export const MysqlOrder = registerAs('MysqlOrder', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_ORDER,
}));
