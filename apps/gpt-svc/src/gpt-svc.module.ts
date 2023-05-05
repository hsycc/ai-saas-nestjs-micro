/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:27
 * @LastEditTime: 2023-05-06 02:30:46
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroConfig } from '@app/config';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/gpt-client';
import { CreateLoggerOption } from '@app/logger';

import { GptModule } from './gpt/gpt.module';
import { PRISMA_CLIENT_SERVICE_NAME, SVC_SERVICE_NAME } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service: SVC_SERVICE_NAME })),
    GptModule,
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_SERVICE_NAME, // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class GptSvcModule {}
