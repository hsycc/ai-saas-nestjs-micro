import { registerAs } from '@nestjs/config';
export default registerAs('mysqlProduct', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_PRODUCT,
}));
