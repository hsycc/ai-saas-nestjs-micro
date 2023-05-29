/*
 * @Author: hsycc
 * @Date: 2023-05-11 02:33:22
 * @LastEditTime: 2023-05-29 07:05:59
 * @Description:
 *
 */
import { AiConfig, MicroConfig, NacosConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { WinstonModule } from 'nest-winston';
import { CustomPrismaModule } from 'nestjs-prisma';
import { PrismaClient } from '@prisma/@ai-client';
import { OpenAiModule } from '@lib/open-ai';
import { ChatModule } from './chat/chat.module';
import { MICRO_SERVER_NAME_AI } from './constants';
import { SpeechModule } from './speech/speech.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig, AiConfig, NacosConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(
      CreateLoggerOption({ service: MICRO_SERVER_NAME_AI }),
    ),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_AI, // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
    }),

    ChatModule,
    OpenAiModule,
    SpeechModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AiSvcModule {}
