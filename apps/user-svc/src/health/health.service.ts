/*
 * @Author: hsycc
 * @Date: 2023-05-29 08:03:58
 * @LastEditTime: 2023-05-30 01:19:48
 * @Description:
 *
 */

import { Injectable } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import {
  HealthCheckRequest,
  HealthCheckResponse,
  HealthCheckResponse_ServingStatus,
} from '@proto/gen/health.pb';

@Injectable()
export class HealthService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  check(payload: HealthCheckRequest, metadata: Metadata): HealthCheckResponse {
    return { status: HealthCheckResponse_ServingStatus.SERVING };
  }
}
