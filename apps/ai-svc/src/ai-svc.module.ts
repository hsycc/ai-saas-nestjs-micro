/*
 * @Author: hsycc
 * @Date: 2023-05-11 02:33:22
 * @LastEditTime: 2023-06-05 00:30:16
 * @Description:
 *
 */
import { AiConfig, MicroConfig, NacosConfig } from '@lib/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom';
import { PrismaClient } from '@prisma/@ai-client';
import { OpenAiModule } from '@lib/open-ai';
import { ChatModule } from './chat/chat.module';
import { SpeechModule } from './speech/speech.module';
import { HealthModule } from './health/health.module';
import { ClsModule } from 'nestjs-cls';

import {
  OpenTelemetryModule,
  ControllerInjector,
  GuardInjector,
  EventEmitterInjector,
  ScheduleInjector,
  PipeInjector,
} from '@metinseylan/nestjs-opentelemetry';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import {
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig, AiConfig, NacosConfig],
      isGlobal: true,
    }),

    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_AI, // 👈 must be unique for each PrismaClient
      useFactory: () => {
        return new PrismaClient(); // create new instance of PrismaClient
      },
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

    OpenTelemetryModule.forRoot({
      serviceName: 'ai-saas-ai-svc',
      traceAutoInjectors: [
        ControllerInjector,
        GuardInjector,
        EventEmitterInjector,
        ScheduleInjector,
        PipeInjector,
      ],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      spanProcessor: new SimpleSpanProcessor(
        new ZipkinExporter({
          url: 'http://localhost:9411/api/v2/spans',
        }),
      ),
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
