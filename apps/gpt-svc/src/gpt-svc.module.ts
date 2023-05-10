/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:27
 * @LastEditTime: 2023-05-10 00:07:56
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MicroConfig } from '@lib/config';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/gpt-client';
import { CreateLoggerOption } from '@lib/logger';

import { GptModule } from './gpt/gpt.module';
import { SVC_SERVICE_NAME } from './constants';
import { PRISMA_CLIENT_NAME_GPT } from '@prisma/scripts/constants';

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
      name: PRISMA_CLIENT_NAME_GPT, // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class GptSvcModule {}
