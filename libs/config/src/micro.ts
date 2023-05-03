import { registerAs } from '@nestjs/config';

export const MicroConfig = registerAs('MicroConfig', () => ({
  microUserDomain: process.env.MICRO_USER_DOMAIN,
  microUserPort: process.env.MICRO_USER_PORT,
  microUserProto: process.env.MICRO_USER_PROTO,

  microGptDomain: process.env.MICRO_GPT_DOMAIN,
  microGptPort: process.env.MICRO_GPT_PORT,
  microGptProto: process.env.MICRO_GPT_PROTO,
}));
