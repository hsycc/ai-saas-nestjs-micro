/*
 * @Author: hsycc
 * @Date: 2023-05-11 02:33:22
 * @LastEditTime: 2023-05-18 14:12:13
 * @Description:
 *
 */
import { AiConfig, MicroConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/@ai-client';
import { OpenAiModule } from '@lib/open-ai';
import { ChatModule } from './chat/chat.module';
import { SVC_SERVICE_NAME } from './constants';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig, AiConfig],
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
    OpenAiModule,
  ],
  controllers: [],
  providers: [],
})
export class AiSvcModule {}
