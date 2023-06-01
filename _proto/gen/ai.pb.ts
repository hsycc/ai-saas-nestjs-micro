/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "grpc.ai.v1";

export enum StatusEnum {
  DISABLE = 0,
  ENABLE = 1,
  UNRECOGNIZED = -1,
}

export interface CreateTranscriptionRequest {
  buffer: Uint8Array;
  prompt?: string | undefined;
  temperature?: number | undefined;
  language_code?: string | undefined;
}

/** alias openai CreateTranscriptionResponse */
export interface CreateTranscriptionResponse {
  text: string;
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
  struct: ChatModelStructItem[];
  questionTpl: string;
  status: StatusEnum;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateChatModelRequest {
  provider?: string | undefined;
  model?: string | undefined;
  name: string;
  struct: ChatModelStructItem[];
  questionTpl?: string | undefined;
}

export interface ChatModelStructItem {
  key: string;
  value: string;
}

export interface UpdateChatModelRequest {
  id: string;
  name?: string | undefined;
  struct: ChatModelStructItem[];
  questionTpl?: string | undefined;
}

export interface ChatModelList {
  results: ChatModel[];
  pagination: Pagination | undefined;
}

export interface QueryChatModelByIdRequest {
  id: string;
}

export interface QueryChatModelListRequest {
  current?: number | undefined;
  pageSize?: number | undefined;
}

/** alias openai ChatCompletionRequestMessage */
export interface ChatCompletionRequestMessage {
  role?: string | undefined;
  content?: string | undefined;
  name?: string | undefined;
}

export interface CreateChatCompletionRequest {
  chaModelId?: string | undefined;
  question: string;
  messages: ChatCompletionRequestMessage[];
}

/** alias openai CreateChatCompletionResponseChoicesInner */
export interface CreateChatCompletionResponseChoicesInner {
  index?: number | undefined;
  message?: ChatCompletionRequestMessage | undefined;
  finish_reason?: string | undefined;
}

export interface CreateChatCompletionChoicesResponse {
  choices: CreateChatCompletionResponseChoicesInner[];
}

export const GRPC_AI_V1_PACKAGE_NAME = "grpc.ai.v1";

export interface AiSpeechServiceClient {
  createTranscription(
    request: CreateTranscriptionRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<CreateTranscriptionResponse>;
}

export interface AiSpeechServiceController {
  createTranscription(
    request: CreateTranscriptionRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CreateTranscriptionResponse> | Observable<CreateTranscriptionResponse> | CreateTranscriptionResponse;
}

export function AiSpeechServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createTranscription"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AiSpeechService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AiSpeechService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AI_SPEECH_SERVICE_NAME = "AiSpeechService";

export interface AiChatModelServiceClient {
  createChatModel(request: CreateChatModelRequest, metadata: Metadata, ...rest: any): Observable<ChatModel>;

  deleteChatModel(request: QueryChatModelByIdRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  updateChatModel(request: UpdateChatModelRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  getChatModelById(request: QueryChatModelByIdRequest, metadata: Metadata, ...rest: any): Observable<ChatModel>;

  getChatModelList(request: QueryChatModelListRequest, metadata: Metadata, ...rest: any): Observable<ChatModelList>;

  createChatCompletion(
    request: CreateChatCompletionRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<CreateChatCompletionChoicesResponse>;
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

  createChatCompletion(
    request: CreateChatCompletionRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<CreateChatCompletionChoicesResponse>
    | Observable<CreateChatCompletionChoicesResponse>
    | CreateChatCompletionChoicesResponse;
}

export function AiChatModelServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createChatModel",
      "deleteChatModel",
      "updateChatModel",
      "getChatModelById",
      "getChatModelList",
      "createChatCompletion",
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
