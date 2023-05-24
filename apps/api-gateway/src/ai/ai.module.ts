/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:24
 * @LastEditTime: 2023-05-24 19:49:58
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';

import { AiController } from './ai.controller';
import { AI_PACKAGE_NAME } from '@proto/gen/ai.pb';

@Module({
  controllers: [AiController],
  providers: [
    {
      provide: AI_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: MicroConfig.microDomainAi + ':' + MicroConfig.microPortAi,
            package: AI_PACKAGE_NAME,
            protoPath: MicroConfig.microProtoAi,
            loader: {
              keepCase: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
    // {
    //   provide: AI_SPEECH_SERVICE_NAME,
    //   useFactory: (config: ConfigService) => {
    //     const MicroConfig = config.get<MicroConfigType>('MicroConfig');
    //     return ClientProxyFactory.create({
    //       transport: Transport.GRPC,
    //       options: {
    //         url: MicroConfig.microDomainAi + ':' + MicroConfig.microPortAi,
    //         package: AI_PACKAGE_NAME,
    //         protoPath: MicroConfig.microProtoAi,
    //         loader: {
    //           keepCase: true,
    //         },
    //       },
    //     });
    //   },
    //   inject: [ConfigService],
    // },
  ],
})
export class AiModule {}
