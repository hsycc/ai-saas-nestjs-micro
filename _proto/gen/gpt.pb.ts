/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "gpt";

export interface FindOneRequest {
  id: number;
}

export interface FindOneResponse {
  text: string;
}

export const GPT_PACKAGE_NAME = "gpt";

export interface GptServiceClient {
  stt(request: FindOneRequest, metadata: Metadata, ...rest: any): Observable<FindOneResponse>;
}

export interface GptServiceController {
  stt(
    request: FindOneRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;
}

export function GptServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["stt"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GptService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GptService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const GPT_SERVICE_NAME = "GptService";
