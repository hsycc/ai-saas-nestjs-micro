/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-06-02 08:17:41
 * @Description:
 *
 */
import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CustomPrismaService } from 'nestjs-prisma/dist/custom';
import { WinstonModule } from 'nest-winston';
import { join } from 'path';
import { GRPC_USER_V1_PACKAGE_NAME } from '@proto/gen/user.pb';
import { GRPC_HEALTH_V1_PACKAGE_NAME } from '@proto/gen/health.pb';
import { MICRO_PROTO_HEALTH } from '@app/api-gateway/constants';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { UserSvcModule } from './user-svc.module';
import { GrpcServerExceptionFilter, GrpcBodyValidationPipe } from '@lib/grpc';
import { MICRO_PROTO_USER, MICRO_SERVER_NAME_USER } from './constants';

import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@user-client';
import { PrismaLoggingMiddleware, QueryInfo } from '@lib/common';

const { NODE_ENV, MICRO_PORT_USER } = process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({
    defaultMeta: { application: MICRO_SERVER_NAME_USER },
  }),
);

async function bootstrap() {
  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);

  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    UserSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${MICRO_PORT_USER}`,
        package: [GRPC_USER_V1_PACKAGE_NAME, GRPC_HEALTH_V1_PACKAGE_NAME],
        protoPath: [
          join(process.cwd(), MICRO_PROTO_USER),
          join(process.cwd(), MICRO_PROTO_HEALTH),
        ],
        loader: {
          keepCase: true,
        },
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

  // 开启shutdownHooks
  app.enableShutdownHooks();

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_USER, // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  customPrismaService.client.$use(
    PrismaLoggingMiddleware({
      logger: new Logger('PrismaLoggingMiddleware'),
      logLevel: 'log', // default is `debug`
      logMessage: (query: QueryInfo) =>
        `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
    }) as any,
  );

  try {
    // prisma 连接到数据库
    await customPrismaService.client.$connect();

    await app.listen();
    logger.log(
      `grpc 0.0.0.0:${MICRO_PORT_USER} ${MICRO_SERVER_NAME_USER} 微服务启动成功`,
      bootstrap.name,
    );
  } catch (error) {
    logger.error(`连接到pg数据库失败: ${error}`, bootstrap.name);
  }
}

bootstrap();
