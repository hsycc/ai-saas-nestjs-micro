/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-07 09:52:30
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GPT_SERVICE_NAME, GPT_PACKAGE_NAME } from '@proto/gen/gpt.pb';
import { GptController } from './gpt.controller';
import { MicroConfigType } from '@lib/config';
import { InterceptingCall } from '@grpc/grpc-js';

@Module({
  controllers: [GptController],
  imports: [],
  providers: [
    {
      provide: GPT_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${MicroConfig.microDomainGpt}:${MicroConfig.microPortGpt}`,
            package: GPT_PACKAGE_NAME,
            protoPath: MicroConfig.microProtoGpt,
            channelOptions: {
              interceptors: [
                (options, nextCall) => {
                  console.log('CALLED INTERCEPTOR');
                  return new InterceptingCall(nextCall(options));
                },
              ],
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class GptModule {}
