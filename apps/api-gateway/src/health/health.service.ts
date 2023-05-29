/*
 * @Author: hsycc
 * @Date: 2023-05-29 08:03:58
 * @LastEditTime: 2023-05-29 22:22:34
 * @Description:
 *
 */
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { GRPCHealthIndicator, HealthCheckService } from '@nestjs/terminus';
import { GrpcOptions } from '@nestjs/microservices';
import {
  GRPC_AI_V1_PACKAGE_NAME,
  HEALTH_SERVICE_NAME,
  HealthClient,
} from '@proto/gen/ai.pb';
import { Metadata } from '@grpc/grpc-js';
import { join } from 'path';
import { MICRO_PROTO_AI, MICRO_SERVER_NAME_AI } from '@app/ai-svc/constants';
import { MicroConfigType } from '@lib/config';
import {
  MICRO_PROTO_USER,
  MICRO_SERVER_NAME_USER,
} from '@app/user-svc/constants';
import { GRPC_USER_V1_PACKAGE_NAME } from '@proto/gen/user.pb';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private grpc: GRPCHealthIndicator,
    private config: ConfigService,
  ) {}

  check() {
    const MicroConfig = this.config.get<MicroConfigType>('MicroConfig');

    return this.health.check([
      ...MicroConfig.microServerAddrAi.split(',').map((v) => {
        return async () =>
          this.grpc.checkService<GrpcOptions>(
            MICRO_SERVER_NAME_AI + '-' + v,
            'health', // 占位字段
            {
              url: v,
              timeout: 1000,
              package: GRPC_AI_V1_PACKAGE_NAME,
              protoPath: join(process.cwd(), MICRO_PROTO_AI),
              // The name of the service you need for the health check
              healthServiceName: HEALTH_SERVICE_NAME,
              // Your custom function which checks the service
              healthServiceCheck: (
                healthService: HealthClient,
                service: string,
              ) => {
                return lastValueFrom(
                  healthService.check({ service }, new Metadata()),
                );
              },
            },
          );
      }),

      ...MicroConfig.microServerAddrUser.split(',').map((v) => {
        return async () =>
          this.grpc.checkService<GrpcOptions>(
            MICRO_SERVER_NAME_USER + '-' + v,
            'health', // 占位字段
            {
              url: v,
              timeout: 1000,
              package: GRPC_USER_V1_PACKAGE_NAME,
              protoPath: join(process.cwd(), MICRO_PROTO_USER),
              // The name of the service you need for the health check
              healthServiceName: HEALTH_SERVICE_NAME,
              // Your custom function which checks the service
              healthServiceCheck: (
                healthService: HealthClient,
                service: string,
              ) => {
                return lastValueFrom(
                  healthService.check({ service }, new Metadata()),
                );
              },
            },
          );
      }),
    ]);
  }
}
