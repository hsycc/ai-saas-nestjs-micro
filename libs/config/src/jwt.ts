import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => ({
  secretKey: process.env.JWT_SECRET_KEY,
}));
