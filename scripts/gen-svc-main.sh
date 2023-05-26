###
 # @Author: hsycc
 # @Date: 2023-05-11 01:29:45
 # @LastEditTime: 2023-05-25 02:20:15
 # @Description: 
 # 
### 

#!/bin/bash

current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


#!/bin/bash
if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1

echo "import { join } from 'path';
import { CustomPrismaService } from 'nestjs-prisma';
import { WinstonModule } from 'nest-winston';
import { INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { CreateLoggerOption, GrpcLoggingInterceptor } from '@lib/logger';
import { GrpcBodyValidationPipe, GrpcServerExceptionFilter } from '@lib/grpc';
import { protobufPackage } from '@proto/gen/$module.pb';
import { PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from '@prisma/scripts/constants';

import { $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')SvcModule } from './$module-svc.module';
import { SVC_SERVICE_NAME } from './constants';
import { PrismaClient } from '@prisma/@$module-client';

const { NODE_ENV, MICRO_DOMAIN_$(echo "$module" | tr '[:lower:]' '[:upper:]'), MICRO_PORT_$(echo "$module" | tr '[:lower:]' '[:upper:]'), MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]') } =
  process.env;

const logger = WinstonModule.createLogger(
  CreateLoggerOption({ service: SVC_SERVICE_NAME }),
);

async function bootstrap() {
  /* register grpc */
  const app: INestMicroservice = await NestFactory.createMicroservice(
    $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')SvcModule,
    {
      logger,
      transport: Transport.GRPC,
      options: {
        url: \`\${MICRO_DOMAIN_$(echo "$module" | tr '[:lower:]' '[:upper:]')}:\${MICRO_PORT_$(echo "$module" | tr '[:lower:]' '[:upper:]')}\`,
        package: protobufPackage,
        protoPath: join(process.cwd(), MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]')),
      },
    },
  );

  /* 统一验证DTO 抛出指定异常过滤 */
  app.useGlobalPipes(new GrpcBodyValidationPipe());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new GrpcLoggingInterceptor(logger));

  /** 全局 RpcException 异常抛出 */
  app.useGlobalFilters(new GrpcServerExceptionFilter(logger, SVC_SERVICE_NAME));

  /*  prisma shutdown hook */
  const customPrismaService: CustomPrismaService<PrismaClient> = app.get(
    PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]'), // 👈 use the same name as in app.module.ts
  );
  await customPrismaService.enableShutdownHooks(app);

  logger.log(\`NODE_ENV:\${NODE_ENV || 'dev'}\`, bootstrap.name);
  await app.listen();
  logger.log(
    \`grpc \${MICRO_DOMAIN_$(echo "$module" | tr '[:lower:]' '[:upper:]')}:\${MICRO_PORT_$(echo "$module" | tr '[:lower:]' '[:upper:]')} \${SVC_SERVICE_NAME} 微服务启动成功\`,
    bootstrap.name,
  );
}

bootstrap();" >  $work_dir/apps/$module-svc/src/main.ts