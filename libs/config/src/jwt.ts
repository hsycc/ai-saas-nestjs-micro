/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:55:30
 * @LastEditTime: 2023-05-27 20:17:49
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('JwtConfig', () => ({
  accessSecretKey: process.env.JWT_ACCESS_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || '8h',
}));
