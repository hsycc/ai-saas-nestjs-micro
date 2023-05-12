/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "ai";

export enum StatusEnum {
  DISABLE = 0,
  ENABLE = 1,
  UNRECOGNIZED = -1,
}

export interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export interface ChatModel {
  id: string;
  provider: string;
  model: string;
  name: string;
  struct: StructItem[];
  questionTpl: string;
  status: StatusEnum;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateChatModelRequest {
  userId: string;
  provider?: string | undefined;
  model?: string | undefined;
  name: string;
  struct: StructItem[];
  questionTpl?: string | undefined;
}

export interface StructItem {
  key: string;
  value: string;
}

export interface UpdateChatModelRequest {
  id: string;
  userId: string;
  name?: string | undefined;
  struct: StructItem[];
  questionTpl?: string | undefined;
}

export interface ChatModelList {
  results: ChatModel[];
  pagination: Pagination | undefined;
}

export interface QueryChatModelByIdRequest {
  id: string;
  userId: string;
}

export interface QueryChatModelListRequest {
  userId: string;
  current?: number | undefined;
  pageSize?: number | undefined;
}

export const AI_PACKAGE_NAME = "ai";

export interface AiServiceClient {
  test(request: Empty, metadata: Metadata, ...rest: any): Observable<Empty>;
}

export interface AiServiceController {
  test(request: Empty, metadata: Metadata, ...rest: any): void;
}

export function AiServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["test"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AiService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AiService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AI_SERVICE_NAME = "AiService";

export interface AiChatModelServiceClient {
  createChatModel(request: CreateChatModelRequest, metadata: Metadata, ...rest: any): Observable<ChatModel>;

  deleteChatModel(request: QueryChatModelByIdRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  updateChatModel(request: UpdateChatModelRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  getChatModelById(request: QueryChatModelByIdRequest, metadata: Metadata, ...rest: any): Observable<ChatModel>;

  getChatModelList(request: QueryChatModelListRequest, metadata: Metadata, ...rest: any): Observable<ChatModelList>;
}

export interface AiChatModelServiceController {
  createChatModel(
    request: CreateChatModelRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ChatModel> | Observable<ChatModel> | ChatModel;

  deleteChatModel(request: QueryChatModelByIdRequest, metadata: Metadata, ...rest: any): void;

  updateChatModel(request: UpdateChatModelRequest, metadata: Metadata, ...rest: any): void;

  getChatModelById(
    request: QueryChatModelByIdRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ChatModel> | Observable<ChatModel> | ChatModel;

  getChatModelList(
    request: QueryChatModelListRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<ChatModelList> | Observable<ChatModelList> | ChatModelList;
}

export function AiChatModelServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createChatModel",
      "deleteChatModel",
      "updateChatModel",
      "getChatModelById",
      "getChatModelList",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AiChatModelService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AiChatModelService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AI_CHAT_MODEL_SERVICE_NAME = "AiChatModelService";