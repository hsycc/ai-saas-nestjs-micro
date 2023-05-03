import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GPT_SERVICE_NAME, GPT_PACKAGE_NAME } from '@proto/gen/gpt.pb';
import { GptController } from './gpt.controller';

@Module({
  controllers: [GptController],
  imports: [],
  providers: [
    {
      provide: GPT_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('MicroConfig.microGptDomain') +
              ':' +
              config.get<string>('MicroConfig.microGptPort'),
            package: GPT_PACKAGE_NAME,
            protoPath: config.get<string>('MicroConfig.microGptProto'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class GptModule {}
