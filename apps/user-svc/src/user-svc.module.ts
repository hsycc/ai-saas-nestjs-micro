/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-29 21:04:55
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@lib/logger';

import { UserModule } from './user/user.module';
import { MICRO_SERVER_NAME_USER } from './constants';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@user-client';
import { MicroConfig, NacosConfig } from '@lib/config';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [NacosConfig, MicroConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(
      CreateLoggerOption({ service: MICRO_SERVER_NAME_USER }),
    ),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_USER,
      useFactory: () => {
        return new PrismaClient();
      },
    }),

    HealthModule,

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class UserSvcModule {}
