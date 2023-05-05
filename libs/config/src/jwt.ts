import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('JwtConfig', () => ({
  accessSecretKey: process.env.JWT_ACCESS_SECRET,
  refreshSecretKey: process.env.JWT_REFRESH_SECRET,
  expiresIn: '1d',
  refreshIn: '7d',
  bcryptSaltOrRound: 10,
}));
