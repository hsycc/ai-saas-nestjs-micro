#!/bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 01:29:45
 # @LastEditTime: 2023-06-02 08:18:34
 # @Description: 
 # 
###


current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")

if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1

echo "import { join } from 'path';
import { CustomPrismaService } from 'nestjs-prisma/dist/custom';
import { WinstonModule } from 'nest-winston';
import { INestMicroservice, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MICRO_PROTO_HEALTH } from '@app/api-gateway/constants';
import { PrismaLoggingMiddleware, QueryInfo } from '@lib/common';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { GrpcBodyValidationPipe, GrpcServerExceptionFilter } from '@lib/grpc';
import { GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME } from '@proto/gen/$module.pb';
import { GRPC_HEALTH_V1_PACKAGE_NAME } from '@proto/gen/health.pb';
import { PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@$module-client';
import { $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')SvcModule } from './$module-svc.module';
import { MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]'), MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from './constants';

const { NODE_ENV, MICRO_SERVER_ADDR_$(echo "$module" | tr '[:lower:]' '[:upper:]'), MICRO_PORT_$(echo "$module" | tr '[:lower:]' '[:upper:]') } = process.env;


const logger = WinstonModule.createLogger(
  CreateLoggerOption({
    defaultMeta: {  MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') },
  }),
);

async function bootstrap() {
  logger.log(\`NODE_ENV:\${NODE_ENV}\`, bootstrap.name);
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')SvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: MICRO_SERVER_ADDR_$(echo "$module" | tr '[:lower:]' '[:upper:]'),
        package: [GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME, GRPC_HEALTH_V1_PACKAGE_NAME],
        protoPath: [
          join(process.cwd(), MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]')),
          join(process.cwd(), MICRO_PROTO_HEALTH),
        ],
      },
    },
  );

  /* 统一验证DTO 抛出指定异常过滤 */
  app.useGlobalPipes(new GrpcBodyValidationPipe());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new GrpcLoggingInterceptor(logger));

  /** 全局 RpcException 异常抛出 */
  app.useGlobalFilters(
    new GrpcServerExceptionFilter(logger, MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]')),
  );

  // 开启shutdownHooks
  // app.enableShutdownHooks();

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]'), // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  customPrismaService.client.\$use(
    PrismaLoggingMiddleware({
      logger: new Logger('PrismaLoggingMiddleware'),
      logLevel: 'log', // default is \`debug\`
      logMessage: (query: QueryInfo) =>
        \`[Prisma Query] \${query.model}.\${query.action} - \${query.executionTime}ms\`,
    }) as any,
  );

  try {
    // prisma 连接到数据库
    await customPrismaService.client.\$connect();

    await app.listen();
    logger.log(
      \`grpc 0.0.0.0:\${MICRO_PORT_$(echo "$module" | tr '[:lower:]' '[:upper:]')} \${MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]')} 微服务启动成功\`,
      bootstrap.name,
    );
  } catch (error) {
    logger.error(\`连接到pg数据库失败: \${error}\`, bootstrap.name);
  }


}

bootstrap();" >  $work_dir/apps/$module-svc/src/main.ts