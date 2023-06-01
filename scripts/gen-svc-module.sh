#!/bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 01:29:45
 # @LastEditTime: 2023-06-05 00:03:12
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


echo "import { MicroConfig } from '@lib/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from '@prisma/scripts/constants';
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom';
import { PrismaClient } from '@prisma/@$module-client';
import { HealthModule } from './health/health.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig],
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const metadata = context.switchToRpc().getContext();
          cls.set('userId', metadata.get('userId')[0]);
          cls.set('tenantId', metadata.get('tenantId')[0]);
          cls.set('requestId', metadata.get('requestId')[0]);
        },
      },
    }),
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