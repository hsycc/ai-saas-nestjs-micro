/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:55:30
 * @LastEditTime: 2023-05-18 19:04:53
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('JwtConfig', () => ({
  accessSecretKey: process.env.JWT_ACCESS_SECRET,
  refreshSecretKey: process.env.JWT_REFRESH_SECRET,
  expiresIn: '7d',
  refreshIn: '7d',
}));
