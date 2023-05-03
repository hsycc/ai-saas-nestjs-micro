import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { GptSvcModule } from './gpt-svc.module';
import { protobufPackage } from '@proto/gen/gpt.pb';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@app/logger';

export const service = 'gpt-svc';
const { NODE_ENV, MICRO_GPT_DOMAIN, MICRO_GPT_PORT, MICRO_GPT_PROTO } =
  process.env;

const logger = WinstonModule.createLogger(CreateLoggerOption({ service }));

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    GptSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: MICRO_GPT_DOMAIN + ':' + MICRO_GPT_PORT,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_GPT_PROTO),
      },
    },
  );

  useContainer(app.select(GptSvcModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);
  await app.listen();
  logger.log(
    `tcp://${MICRO_GPT_DOMAIN}:${MICRO_GPT_PORT} ${service} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
