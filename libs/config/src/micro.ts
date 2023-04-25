import { registerAs } from '@nestjs/config';

export const MicroConfig = registerAs('MicroConfig', () => ({
  microAuthDomain: process.env.MICRO_AUTH_DOMAIN,
  microAuthPort: process.env.MICRO_AUTH_PORT,
  microAuthProto: process.env.MICRO_AUTH_PROTO,

  microOrderDomain: process.env.MICRO_ORDER_DOMAIN,
  microOrderPort: process.env.MICRO_ORDER_PORT,
  microOrderProto: process.env.MICRO_ORDER_PROTO,

  microProductDomain: process.env.MICRO_PRODUCT_DOMAIN,
  microProductPort: process.env.MICRO_PRODUCT_PORT,
  microProductProto: process.env.MICRO_PRODUCT_PROTO,
}));
