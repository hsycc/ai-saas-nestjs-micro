/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-28 04:49:02
 * @Description:
 *
 */
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CustomPrismaService } from 'nestjs-prisma';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { protobufPackage } from '@proto/gen/user.pb';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { UserSvcModule } from './user-svc.module';
import { GrpcServerExceptionFilter, GrpcBodyValidationPipe } from '@lib/grpc';
import { MICRO_PROTO_USER, MICRO_SERVER_NAME_USER } from './constants';

import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@user-client';
const { NODE_ENV, MICRO_PORT_USER } = process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({ service: MICRO_SERVER_NAME_USER }),
);

async function bootstrap() {
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    UserSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${MICRO_PORT_USER}`,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_PROTO_USER),
      },
    },
  );

  /* 统一验证DTO 抛出指定异常过滤 */
  app.useGlobalPipes(new GrpcBodyValidationPipe());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new GrpcLoggingInterceptor(logger));

  /** 全局 RpcException 异常抛出 */
  app.useGlobalFilters(
    new GrpcServerExceptionFilter(logger, MICRO_SERVER_NAME_USER),
  );

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_USER, // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);

  // 开启shutdownHooks
  app.enableShutdownHooks();
  await app.listen();

  logger.log(
    `grpc 0.0.0.0:${MICRO_PORT_USER} ${MICRO_SERVER_NAME_USER} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
