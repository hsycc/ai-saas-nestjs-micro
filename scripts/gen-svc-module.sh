###
 # @Author: hsycc
 # @Date: 2023-05-11 01:29:45
 # @LastEditTime: 2023-05-30 00:55:55
 # @Description: 
 # 
### 
current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


#!/bin/bash
if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1


echo "import { MicroConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from '@prisma/scripts/constants';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from './constants';
import { PrismaClient } from '@prisma/@$module-client';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(
      CreateLoggerOption({ service: MICRO_SERVER_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') }),
    ),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]'), // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')SvcModule {}" > $work_dir/apps/$module-svc/src/$module-svc.module.ts