/*
 * @Author: hsycc
 * @Date: 2023-04-20 18:07:23
 * @LastEditTime: 2023-05-05 19:23:49
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const MicroConfig = registerAs('MicroConfig', () => ({
  microDomainUser: process.env.MICRO_DOMAIN_USER,
  microPortUser: process.env.MICRO_PORT_USER,
  microProtoUser: process.env.MICRO_PROTO_USER,

  microDomainGpt: process.env.MICRO_DOMAIN_GPT,
  microPortGpt: process.env.MICRO_PORT_GPT,
  microProtoGpt: process.env.MICRO_PROTO_GPT,
}));
