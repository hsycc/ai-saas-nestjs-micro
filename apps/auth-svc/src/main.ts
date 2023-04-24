import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { protobufPackage } from '@proto/gen/auth.pb';
import { createLoggerOption } from '@app/common/logger';
import { AuthSvcModule } from './auth-svc.module';
import { GrpcExceptionFilter } from '@app/common/filters/grpc-service-exception.filter';
import { TransformInterceptor } from '@app/common/interceptors/transform.interceptor';
import { GrpcServerExceptionFilter } from '@app/grpc-exceptions';

export const serviceName = 'auth-svc';
const { NODE_ENV, MICRO_AUTH_DOMAIN, MICRO_AUTH_PORT, MICRO_AUTH_PROTO } =
  process.env;

const logger = WinstonModule.createLogger(createLoggerOption(serviceName));

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AuthSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: MICRO_AUTH_DOMAIN + ':' + MICRO_AUTH_PORT,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_AUTH_PROTO),
      },
    },
  );

  /* 统一验证DTO 抛出指定异常过滤 */

  // app.useGlobalFilters(new GrpcExceptionFilter());

  // useContainer(app.select(AuthSvcModule), { fallbackOnErrors: true });
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //   }),
  // );
  app.useGlobalFilters(new GrpcServerExceptionFilter());

  // /* 统一请求成功的返回数据 */
  app.useGlobalInterceptors(new TransformInterceptor());

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);

  await app.listen();
  logger.log(
    `grpc ${MICRO_AUTH_DOMAIN}:${MICRO_AUTH_PORT} ${serviceName} 微服务启动成功`,
    bootstrap.name,
  );
  // console.log(app);
}

bootstrap();
