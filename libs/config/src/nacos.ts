/*
 * @Author: hsycc
 * @Date: 2023-05-28 05:14:20
 * @LastEditTime: 2023-05-28 23:13:13
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const NacosConfig = registerAs('NacosConfig', () => ({
  enable: process.env.NACOS_ENABLE === 'true',
  serverAddr: process.env.NACOS_SERVER_ADDR,
  namespace: process.env.NACOS_NAMESPACE,
  group: process.env.NACOS_GROUP,
  username: process.env.NACOS_USERNAME,
  password: process.env.NACOS_PASSWORD,
}));
