import { registerAs } from '@nestjs/config';

export const GptConfig = registerAs('GptConfig', () => ({
  apiKey: process.env.GPT_API_KEY,
}));
