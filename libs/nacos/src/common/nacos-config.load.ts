/*
 * @Author: hsycc
 * @Date: 2023-05-27 23:22:02
 * @LastEditTime: 2023-05-29 06:07:00
 * @Description:
 *
 */

import { ConfigModule } from '@nestjs/config';
import { NacosConfigClient } from 'nacos';

export const setupNacosConfig = () => {
  // 根据环境条件判断 取哪些配置
  return ConfigModule.forRoot({
    load: [async () => loadNacosConfig()],
    isGlobal: true,
    cache: true,
    ignoreEnvFile: true,
  });
};

export const loadNacosConfig = async (): Promise<any> => {
  const client = new NacosConfigClient({
    serverAddr: '127.0.0.1:8848',
    namespace: 'public',
    username: '',
    password: '',
    requestTimeout: 6000,
  } as any);
  const config = await client.getConfig('node-service', 'dev');

  console.log(config, 33);

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ...JSON.parse(config),
    AiConfig: { apiKey: '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' },
    JwtConfig: { accessSecretKey: 'xWehrT4cBbPaFN&JwPCz', expiresIn: '7d' },
    MicroConfig: {
      microServerAddrUser: '127.0.0.1:50051',
      PortUser: '50051',
      microServerAddrAi: '127.0.0.1:50052',
      PortAi: '50052',
    },
  };
};
