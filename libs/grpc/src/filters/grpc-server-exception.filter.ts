/*
 * 全局过滤器 - 处理 grpc-server to http-client  错误信息
 * @Author: hsycc
 * @Date: 2023-04-24 18:48:48
 * @LastEditTime: 2023-06-02 08:23:06
 * @Description:
 *
 */

import {
  ArgumentsHost,
  Catch,
  LoggerService,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError, Observable } from 'rxjs';
import { GrpcExceptionPayload, HTTP_CODE_FROM_GRPC } from '../utils';
import { ServerUnaryCall } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcServerExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  constructor(
    private readonly logger: LoggerService,
    private readonly application: string = 'default-service',
  ) {}
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError() as GrpcExceptionPayload;

    let message: any = error.message;
    message = JSON.parse(message);

    if (typeof message.error === 'string') {
      message.error = {
        message: message.error,
        application: this.application,
      };
    } else if (typeof message.error === 'object') {
      message.error.application = this.application;
    }
    error.message = JSON.stringify(message);

    const ctx = host.switchToRpc();

    const data = ctx.getData();

    const metadata = ctx.getContext();

    const requestTime = metadata.requestTime || 0;

    const serverUnaryCallImpl = host.getArgByIndex(2) as ServerUnaryCall<
      any,
      any
    >;

    const path = serverUnaryCallImpl.getPath();

    this.logger.log(`${path} - ${Date.now() - requestTime}ms`, 'Access');

    this.logger.error(
      `${path} - ${error.code} - ${HTTP_CODE_FROM_GRPC[error.code]}`,
      error,
      GrpcServerExceptionFilter.name,
    );

    this.logger.error(
      `${path} payload:`,
      JSON.stringify(data),
      GrpcServerExceptionFilter.name,
    );

    this.logger.error(
      `grpc err detail:`,
      JSON.stringify(error),
      GrpcServerExceptionFilter.name,
    );

    return throwError(() => error);
  }
}
