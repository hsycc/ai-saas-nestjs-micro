/*
 * @Author: hsycc
 * @Date: 2023-05-11 00:45:11
 * @LastEditTime: 2023-06-02 08:16:42
 * @Description:
 *
 */
import { join } from 'path';
import { CustomPrismaService } from 'nestjs-prisma/dist/custom';
import { WinstonModule } from 'nest-winston';
import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MICRO_PROTO_HEALTH } from '@app/api-gateway/constants';
import { PrismaLoggingMiddleware, QueryInfo } from '@lib/common';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { GrpcBodyValidationPipe, GrpcServerExceptionFilter } from '@lib/grpc';
import { GRPC_AI_V1_PACKAGE_NAME } from '@proto/gen/ai.pb';
import { GRPC_HEALTH_V1_PACKAGE_NAME } from '@proto/gen/health.pb';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@ai-client';

import { AiSvcModule } from './ai-svc.module';
import { MICRO_PROTO_AI, MICRO_SERVER_NAME_AI } from './constants';

const { NODE_ENV, MICRO_PORT_AI } = process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({
    defaultMeta: { application: MICRO_SERVER_NAME_AI },
  }),
);

async function bootstrap() {
  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AiSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:${MICRO_PORT_AI}`,
        package: [GRPC_AI_V1_PACKAGE_NAME, GRPC_HEALTH_V1_PACKAGE_NAME],
        protoPath: [
          join(process.cwd(), MICRO_PROTO_AI),
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
    new GrpcServerExceptionFilter(logger, MICRO_SERVER_NAME_AI),
  );

  // 开启shutdownHooks
  app.enableShutdownHooks();

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_AI, // 👈 use the same name as in app.module.ts
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
      `grpc 0.0.0.0:${MICRO_PORT_AI} ${MICRO_SERVER_NAME_AI} 微服务启动成功`,
      bootstrap.name,
    );
  } catch (error) {
    logger.error(`连接到pg数据库失败: ${error}`, bootstrap.name);
  }
}

bootstrap();
