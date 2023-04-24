import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import {
  PRODUCT_SERVICE_NAME,
  PRODUCT_PACKAGE_NAME,
} from '@proto/gen/product.pb';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [
    {
      provide: PRODUCT_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('microConfig.microProductDomain') +
              ':' +
              config.get<string>('microConfig.microProductPort'),
            package: PRODUCT_PACKAGE_NAME,
            protoPath: config.get<string>('microConfig.microProductProto'),
          },
        });
      },
      inject: [ConfigService],
    },
    OrderService,
  ],
})
export class OrderModule {}
