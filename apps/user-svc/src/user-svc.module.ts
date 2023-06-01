/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-06-05 00:51:44
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CustomPrismaModule } from 'nestjs-prisma/dist/custom';
import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient } from '@prisma/@user-client';
import { MicroConfig, NacosConfig } from '@lib/config';
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
      load: [NacosConfig, MicroConfig],
      isGlobal: true,
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
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: PRISMA_CLIENT_NAME_USER,
      useFactory: () => {
        return new PrismaClient();
      },
    }),

    OpenTelemetryModule.forRoot({
      serviceName: 'ai-saas-user-svc',
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

    HealthModule,

    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class UserSvcModule {}
