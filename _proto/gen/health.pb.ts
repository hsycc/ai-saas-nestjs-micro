/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "grpc.health.v1";

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResponse {
  status: HealthCheckResponse_ServingStatus;
}

export enum HealthCheckResponse_ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  /** SERVICE_UNKNOWN - Used only by the Watch method. */
  SERVICE_UNKNOWN = 3,
  UNRECOGNIZED = -1,
}

export const GRPC_HEALTH_V1_PACKAGE_NAME = "grpc.health.v1";

export interface HealthClient {
  check(request: HealthCheckRequest, metadata: Metadata, ...rest: any): Observable<HealthCheckResponse>;

  watch(request: HealthCheckRequest, metadata: Metadata, ...rest: any): Observable<HealthCheckResponse>;
}

export interface HealthController {
  check(
    request: HealthCheckRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<HealthCheckResponse> | Observable<HealthCheckResponse> | HealthCheckResponse;

  watch(request: HealthCheckRequest, metadata: Metadata, ...rest: any): Observable<HealthCheckResponse>;
}

export function HealthControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["check", "watch"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("Health", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("Health", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const HEALTH_SERVICE_NAME = "Health";
