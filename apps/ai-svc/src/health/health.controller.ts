/*
 * @Author: hsycc
 * @Date: 2023-05-29 08:03:58
 * @LastEditTime: 2023-05-30 01:19:26
 * @Description:
 *
 */
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';
import { HealthService } from './health.service';

import {
  HealthCheckRequest,
  HealthCheckResponse,
  HEALTH_SERVICE_NAME,
} from '@proto/gen/health.pb';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @GrpcMethod(HEALTH_SERVICE_NAME, 'check')
  check(payload: HealthCheckRequest, metadata: Metadata): HealthCheckResponse {
    return this.healthService.check(payload, metadata);
  }
}
