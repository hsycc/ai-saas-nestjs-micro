import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { OrderSvcModule } from './order-svc.module';
import { protobufPackage } from '@proto/gen/order.pb';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@app/logger';

export const service = 'order-svc';
const { NODE_ENV, MICRO_ORDER_DOMAIN, MICRO_ORDER_PORT, MICRO_ORDER_PROTO } =
  process.env;

const logger = WinstonModule.createLogger(CreateLoggerOption({ service }));

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    OrderSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: MICRO_ORDER_DOMAIN + ':' + MICRO_ORDER_PORT,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_ORDER_PROTO),
      },
    },
  );

  useContainer(app.select(OrderSvcModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);
  await app.listen();
  logger.log(
    `tcp://${MICRO_ORDER_DOMAIN}:${MICRO_ORDER_PORT} ${service} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
