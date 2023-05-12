/*
 * @Author: hsycc
 * @Date: 2023-05-11 02:33:22
 * @LastEditTime: 2023-05-11 05:50:51
 * @Description:
 *
 */
import { MicroConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { SVC_SERVICE_NAME } from './constants';
import { PrismaClient } from '@prisma/@ai-client';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service: SVC_SERVICE_NAME })),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_AI, // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
    }),
    ChatModule,
  ],
  controllers: [],
  providers: [],
})
export class AiSvcModule {}
