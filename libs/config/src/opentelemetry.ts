/*
 * @Author: hsycc
 * @Date: 2023-06-05 01:06:09
 * @LastEditTime: 2023-06-05 01:11:13
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const OpentelemetryConfig = registerAs('OpentelemetryConfig', () => ({
  enable: process.env.OPENTELEMETRY_ENABLE === 'true',
  zipkinUrl: process.env.OPENTELEMETRY_ZIPKIN_URL,
}));
