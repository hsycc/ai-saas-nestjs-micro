/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty } from "./google/protobuf/empty.pb";

export const protobufPackage = "user";

export enum UserStatusEnum {
  DISABLE = 0,
  ENABLE = 1,
  UNRECOGNIZED = -1,
}

export enum UserRolesEnum {
  USER = 0,
  ADMIN = 1,
  UNRECOGNIZED = -1,
}

export interface UserModel {
  id: string;
  username: string;
  avatar: string;
  password: string;
  status: UserStatusEnum;
  role: UserRolesEnum;
  accessKey: string;
  secretKey: string;
  createdAt: number;
  updatedAt: number;
}

export interface UserModelList {
  list: UserModel[];
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  id: string;
  avatar?: string | undefined;
  password?: string | undefined;
  status?: UserStatusEnum | undefined;
  role?: UserRolesEnum | undefined;
  accessKey?: string | undefined;
  secretKey?: string | undefined;
}

export interface QueryUserByIdRequest {
  id: string;
}

export interface QueryUserByNameRequest {
  username: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  createUser(request: CreateUserRequest, metadata: Metadata, ...rest: any): Observable<UserModel>;

  deleteUser(request: QueryUserByIdRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  updateUser(request: UpdateUserRequest, metadata: Metadata, ...rest: any): Observable<Empty>;

  getUserByName(request: QueryUserByNameRequest, metadata: Metadata, ...rest: any): Observable<UserModel>;

  getUserById(request: QueryUserByIdRequest, metadata: Metadata, ...rest: any): Observable<UserModel>;

  getUserModelList(request: Empty, metadata: Metadata, ...rest: any): Observable<UserModelList>;
}

export interface UserServiceController {
  createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserModel> | Observable<UserModel> | UserModel;

  deleteUser(request: QueryUserByIdRequest, metadata: Metadata, ...rest: any): void;

  updateUser(request: UpdateUserRequest, metadata: Metadata, ...rest: any): void;

  getUserByName(
    request: QueryUserByNameRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserModel> | Observable<UserModel> | UserModel;

  getUserById(
    request: QueryUserByIdRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserModel> | Observable<UserModel> | UserModel;

  getUserModelList(
    request: Empty,
    metadata: Metadata,
    ...rest: any
  ): Promise<UserModelList> | Observable<UserModelList> | UserModelList;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "createUser",
      "deleteUser",
      "updateUser",
      "getUserByName",
      "getUserById",
      "getUserModelList",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
