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
  /**
   * If the requested service is unknown, the call will fail with status
   * NOT_FOUND.
   */

  check(request: HealthCheckRequest, metadata: Metadata, ...rest: any): Observable<HealthCheckResponse>;

  /**
   * Performs a watch for the serving status of the requested service.
   * The server will immediately send back a message indicating the current
   * serving status.  It will then subsequently send a new message whenever
   * the service's serving status changes.
   *
   * If the requested service is unknown when the call is received, the
   * server will send a message setting the serving status to
   * SERVICE_UNKNOWN but will *not* terminate the call.  If at some
   * future point, the serving status of the service becomes known, the
   * server will send a new message with the service's serving status.
   *
   * If the call terminates with status UNIMPLEMENTED, then clients
   * should assume this method is not supported and should not retry the
   * call.  If the call terminates with any other status (including OK),
   * clients should retry the call with appropriate exponential backoff.
   */

  watch(request: HealthCheckRequest, metadata: Metadata, ...rest: any): Observable<HealthCheckResponse>;
}

export interface HealthController {
  /**
   * If the requested service is unknown, the call will fail with status
   * NOT_FOUND.
   */

  check(
    request: HealthCheckRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<HealthCheckResponse> | Observable<HealthCheckResponse> | HealthCheckResponse;

  /**
   * Performs a watch for the serving status of the requested service.
   * The server will immediately send back a message indicating the current
   * serving status.  It will then subsequently send a new message whenever
   * the service's serving status changes.
   *
   * If the requested service is unknown when the call is received, the
   * server will send a message setting the serving status to
   * SERVICE_UNKNOWN but will *not* terminate the call.  If at some
   * future point, the serving status of the service becomes known, the
   * server will send a new message with the service's serving status.
   *
   * If the call terminates with status UNIMPLEMENTED, then clients
   * should assume this method is not supported and should not retry the
   * call.  If the call terminates with any other status (including OK),
   * clients should retry the call with appropriate exponential backoff.
   */

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
