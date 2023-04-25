import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import {
  PRODUCT_PACKAGE_NAME,
  PRODUCT_SERVICE_NAME,
} from '@proto/gen/product.pb';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  imports: [],
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
  ],
})
export class ProductModule {}
