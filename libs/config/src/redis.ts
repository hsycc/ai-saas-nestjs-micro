import { registerAs } from '@nestjs/config';

export const RedisConfig = registerAs('RedisConfig', () => ({}));
