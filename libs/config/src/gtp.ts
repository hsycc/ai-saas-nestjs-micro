import { registerAs } from '@nestjs/config';

export default registerAs('gtpConfig', () => ({
  apiKey: process.env.GTP_API_KEY,
}));
