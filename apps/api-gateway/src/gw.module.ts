/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-06-05 01:24:05
 * @Description:
 *
 */

import { Request } from 'express';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AiConfig,
  JwtConfig,
  MicroConfig,
  NacosConfig,
  OpentelemetryConfig,
  OpentelemetryConfigType,
} from '@lib/config';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { GwController } from './gw.controller';
import { GwService } from './gw.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { GptModule } from './gpt/gpt.module';

import { HealthModule } from './health/health.module';

import { v4 as uuid } from 'uuid';
import { FormatClsMetadata } from './auth/decorators/cls-metadata.decorator';
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
      isGlobal: true,
      load: [
        AiConfig,
        JwtConfig,
        MicroConfig,
        NacosConfig,
        OpentelemetryConfig,
      ],
      expandVariables: true,
      envFilePath: ['.env.production', '.env'],
    }),

    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => req.headers['x-request-id'] ?? uuid(),
        // setup: () => {},
      },
      interceptor: {
        mount: true,
        setup: (cls, context) => {
          const req = context
            .switchToHttp()
            .getRequest<Request & FormatClsMetadata>();

          cls.set('userId', req.user?.id || -1);

          cls.set('tenantId', req?.tenant?.id || -1);
        },
      },
    }),

    OpenTelemetryModule.forRootAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => {
        return {
          serviceName:
            'ai-saas-api-gateway-' + process.env.NODE_ENV
              ? process.env.NODE_ENV
              : 'local',
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
              url: configService.get<OpentelemetryConfigType>(
                'OpentelemetryConfig',
              ).zipkinUrl,
            }),
          ),
        } as any;
      },
      inject: [ConfigService],
    }),

    HealthModule,
    AuthModule,
    UserModule,
    AiModule,
    GptModule,
  ],
  controllers: [GwController],
  providers: [GwService],
})
export class GwModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClsMiddleware).forRoutes('*');
  }
}
