import { registerAs } from '@nestjs/config';

export const GtpConfig = registerAs('GtpConfig', () => ({
  apiKey: process.env.GTP_API_KEY,
}));
