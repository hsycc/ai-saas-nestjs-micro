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
              config.get<string>('MicroConfig.microProductDomain') +
              ':' +
              config.get<string>('MicroConfig.microProductPort'),
            package: PRODUCT_PACKAGE_NAME,
            protoPath: config.get<string>('MicroConfig.microProductProto'),
          },
        });
      },
      inject: [ConfigService],
    },
    OrderService,
  ],
})
export class OrderModule {}
