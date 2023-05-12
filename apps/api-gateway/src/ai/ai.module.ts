/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:24
 * @LastEditTime: 2023-05-11 06:22:22
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';

import { AiController } from './ai.controller';
import {
  AI_CHAT_MODEL_SERVICE_NAME,
  AI_PACKAGE_NAME,
  AI_SERVICE_NAME,
} from '@proto/gen/ai.pb';

@Module({
  controllers: [AiController],
  providers: [
    {
      provide: AI_CHAT_MODEL_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: MicroConfig.microDomainAi + ':' + MicroConfig.microPortAi,
            package: AI_PACKAGE_NAME,
            protoPath: MicroConfig.microProtoAi,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: AI_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: MicroConfig.microDomainAi + ':' + MicroConfig.microPortAi,
            package: AI_PACKAGE_NAME,
            protoPath: MicroConfig.microProtoAi,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
