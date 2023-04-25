import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('JwtConfig', () => ({
  secretKey: process.env.JWT_SECRET_KEY,
}));
