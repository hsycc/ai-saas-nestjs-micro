import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { protobufPackage } from '@proto/gen/product.pb';
import { ProductSvcModule } from './product-svc.module';
import { createLoggerOption } from '@app/common/logger';
import { WinstonModule } from 'nest-winston';

export const serviceName = 'product-svc';
const {
  NODE_ENV,
  MICRO_PRODUCT_DOMAIN,
  MICRO_PRODUCT_PORT,
  MICRO_PRODUCT_PROTO,
} = process.env;

const logger = WinstonModule.createLogger(createLoggerOption(serviceName));

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    ProductSvcModule,
    {
      transport: Transport.GRPC,
      options: {
        url: MICRO_PRODUCT_DOMAIN + ':' + MICRO_PRODUCT_PORT,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_PRODUCT_PROTO),
      },
    },
  );

  useContainer(app.select(ProductSvcModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);
  await app.listen();
  logger.log(
    `tcp://${MICRO_PRODUCT_DOMAIN}:${MICRO_PRODUCT_PORT} ${serviceName} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
