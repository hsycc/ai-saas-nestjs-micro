import { join } from 'path';
import { CustomPrismaService } from 'nestjs-prisma';
import { WinstonModule } from 'nest-winston';
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { GrpcBodyValidationPipe, GrpcServerExceptionFilter } from '@lib/grpc';
import { protobufPackage } from '@proto/gen/ai.pb';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';

import { AiSvcModule } from './ai-svc.module';
import { SVC_SERVICE_NAME } from './constants';
import { PrismaClient } from '@prisma/@ai-client';

const { NODE_ENV, MICRO_DOMAIN_AI, MICRO_PORT_AI, MICRO_PROTO_AI } =
  process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({ service: SVC_SERVICE_NAME }),
);

async function bootstrap() {
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AiSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `${MICRO_DOMAIN_AI}:${MICRO_PORT_AI}`,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_PROTO_AI),
      },
    },
  );

  // TODO: 改写 PrismaClientExceptionFilter
  // TODO: add custom prisma logger loggingMiddleware
  // const { httpAdapter } = app.get(HttpAdapterHost);

  // app.useGlobalFilters(
  //   new PrismaClientExceptionFilter(httpAdapter, {
  //     // Prisma Error Code: HTTP Status Response
  //     P2000: HttpStatus.BAD_REQUEST,
  //     P2002: HttpStatus.CONFLICT,
  //     P2025: HttpStatus.NOT_FOUND,
  //   }),
  // );

  /* 统一验证DTO 抛出指定异常过滤 */
  app.useGlobalPipes(new GrpcBodyValidationPipe());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new GrpcLoggingInterceptor(logger));

  /** 全局 RpcException 异常抛出 */
  app.useGlobalFilters(new GrpcServerExceptionFilter(logger, SVC_SERVICE_NAME));

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_AI, // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  logger.log(`NODE_ENV:${NODE_ENV || 'dev'}`, bootstrap.name);
  await app.listen();
  logger.log(
    `grpc ${MICRO_DOMAIN_AI}:${MICRO_PORT_AI} ${SVC_SERVICE_NAME} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
