/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-10 01:27:16
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@lib/logger';

import { UserModule } from './user/user.module';
import { SVC_SERVICE_NAME } from './constants';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@user-client';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service: SVC_SERVICE_NAME })),

    UserModule,
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_USER,
      useFactory: () => {
        return new PrismaClient();
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserSvcModule {}
