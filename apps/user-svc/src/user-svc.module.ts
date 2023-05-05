/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-06 02:30:59
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@app/logger';
import { JwtConfig } from '@app/config';

import { UserModule } from './user/user.module';
import { PRISMA_CLIENT_SERVICE_NAME, SVC_SERVICE_NAME } from './constants';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/user-client';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [JwtConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service: SVC_SERVICE_NAME })),

    UserModule,
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_SERVICE_NAME,
      useFactory: () => {
        return new PrismaClient();
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class UserSvcModule {}
