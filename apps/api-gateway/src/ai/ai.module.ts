/*
 * @Author: hsycc
 * @Date: 2023-05-10 23:21:24
 * @LastEditTime: 2023-06-01 07:48:31
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';
import { AiController } from './ai.controller';
import { GRPC_AI_V1_PACKAGE_NAME } from '@proto/gen/ai.pb';
import { MICRO_PROTO_AI } from '@app/ai-svc/constants';
import { join } from 'path';

@Module({
  imports: [],
  controllers: [AiController],
  providers: [
    {
      provide: GRPC_AI_V1_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');

        return MicroConfig.microServerAddrAi.split(',').map((v) => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              url: v,
              package: [GRPC_AI_V1_PACKAGE_NAME],
              protoPath: [join(process.cwd(), MICRO_PROTO_AI)],
              loader: {
                keepCase: true,
              },
            },
          });
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
