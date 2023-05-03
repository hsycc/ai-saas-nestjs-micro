import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { protobufPackage } from '@proto/gen/user.pb';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@app/logger';
import { UserSvcModule } from './user-svc.module';
import {
  GrpcServerExceptionFilter,
  GrpcBodyValidationPipe,
} from '@app/grpc-to-http-exceptions';

export const service = 'user-svc';
const { NODE_ENV, MICRO_USER_DOMAIN, MICRO_USER_PORT, MICRO_USER_PROTO } =
  process.env;

const logger = WinstonModule.createLogger(CreateLoggerOption({ service }));

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    UserSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: MICRO_USER_DOMAIN + ':' + MICRO_USER_PORT,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_USER_PROTO),
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
    `grpc ${MICRO_USER_DOMAIN}:${MICRO_USER_PORT} ${service} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
