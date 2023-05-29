/*
 * @Author: hsycc
 * @Date: 2023-04-20 18:07:23
 * @LastEditTime: 2023-05-29 06:05:30
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const MicroConfig = registerAs('MicroConfig', () => ({
  microPortGw: process.env.PORT,

  microServerAddrUser: process.env.MICRO_SERVER_ADDR_USER,
  microPortUser: process.env.MICRO_PORT_USER,

  microServerAddrAi: process.env.MICRO_SERVER_ADDR_AI,
  microPortAi: process.env.MICRO_PORT_AI,

  // sedMicroConfigUnRemove
}));
