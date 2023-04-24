import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ORDER_SERVICE_NAME, ORDER_PACKAGE_NAME } from '@proto/gen/order.pb';
import { OrderController } from './order.controller';

@Module({
  controllers: [OrderController],
  imports: [],
  providers: [
    {
      provide: ORDER_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('microConfig.microOrderDomain') +
              ':' +
              config.get<string>('microConfig.microOrderPort'),
            package: ORDER_PACKAGE_NAME,
            protoPath: config.get<string>('microConfig.microOrderProto'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class OrderModule {}
