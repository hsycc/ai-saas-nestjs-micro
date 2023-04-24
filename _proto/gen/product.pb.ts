/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "product";

export interface CreateProductRequest {
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export interface CreateProductResponse {
  status: number;
  error: string[];
  id: number;
}

export interface FindOneData {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
}

export interface FindOneRequest {
  id: number;
}

export interface FindOneResponse {
  status: number;
  error: string[];
  data: FindOneData | undefined;
}

export interface DecreaseStockRequest {
  id: number;
}

export interface DecreaseStockResponse {
  status: number;
  error: string[];
}

export const PRODUCT_PACKAGE_NAME = "product";

export interface ProductServiceClient {
  createProduct(request: CreateProductRequest, metadata: Metadata, ...rest: any): Observable<CreateProductResponse>;

  findOne(request: FindOneRequest, metadata: Metadata, ...rest: any): Observable<FindOneResponse>;

  decreaseStock(request: DecreaseStockRequest, metadata: Metadata, ...rest: any): Observable<DecreaseStockResponse>;
}

export interface ProductServiceController {
  createProduct(
    request: CreateProductRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CreateProductResponse> | Observable<CreateProductResponse> | CreateProductResponse;

  findOne(
    request: FindOneRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<FindOneResponse> | Observable<FindOneResponse> | FindOneResponse;

  decreaseStock(
    request: DecreaseStockRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<DecreaseStockResponse> | Observable<DecreaseStockResponse> | DecreaseStockResponse;
}

export function ProductServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createProduct", "findOne", "decreaseStock"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ProductService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRODUCT_SERVICE_NAME = "ProductService";
