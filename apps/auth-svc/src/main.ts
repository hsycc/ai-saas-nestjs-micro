import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { protobufPackage } from '@proto/gen/auth.pb';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@app/logger';
import { AuthSvcModule } from './auth-svc.module';
import {
  GrpcServerExceptionFilter,
  GrpcBodyValidationPipe,
} from '@app/grpc-exceptions';

export const service = 'auth-svc';
const { NODE_ENV, MICRO_AUTH_DOMAIN, MICRO_AUTH_PORT, MICRO_AUTH_PROTO } =
  process.env;

const logger = WinstonModule.createLogger(CreateLoggerOption({ service }));

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
  app.useGlobalPipes(new GrpcBodyValidationPipe());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new GrpcLoggingInterceptor(logger));

  /** 全局 RpcException 异常抛出 */
  app.useGlobalFilters(new GrpcServerExceptionFilter(logger, service));

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);

  await app.listen();

  logger.log(
    `grpc ${MICRO_AUTH_DOMAIN}:${MICRO_AUTH_PORT} ${service} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
