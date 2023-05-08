/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:18:22
 * @LastEditTime: 2023-05-07 08:54:09
 * @Description:
 *
 */
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GptSvcModule } from './gpt-svc.module';
import { protobufPackage } from '@proto/gen/gpt.pb';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@app/logger';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/gpt-client';
import {
  GrpcBodyValidationPipe,
  GrpcServerExceptionFilter,
} from 'libs/grpc/src';
import { PRISMA_CLIENT_SERVICE_NAME, SVC_SERVICE_NAME } from './constants';

const { NODE_ENV, MICRO_DOMAIN_GPT, MICRO_PORT_GPT, MICRO_PROTO_GPT } =
  process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({ service: SVC_SERVICE_NAME }),
);

async function bootstrap() {
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    GptSvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: `${MICRO_DOMAIN_GPT}:${MICRO_PORT_GPT}`,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_PROTO_GPT),
      },
    },
  );

  // TODO: 改写 PrismaClientExceptionFilter
  // TODO: add custom prisma logger loggingMiddleware
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // console.log(httpAdapter, 233);

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
    PRISMA_CLIENT_SERVICE_NAME, // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  logger.log(`NODE_ENV:${NODE_ENV || 'dev'}`, bootstrap.name);
  await app.listen();
  logger.log(
    `grpc ${MICRO_DOMAIN_GPT}:${MICRO_PORT_GPT} ${SVC_SERVICE_NAME} 微服务启动成功`,
    bootstrap.name,
  );
}

bootstrap();
