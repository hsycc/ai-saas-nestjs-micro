/*
 * 为请求统一打上时间戳, 日志拦截器
 * @Author:
 * @Date: 2023-04-25 13:24:34
 * @LastEditTime: 2023-04-25 17:59:41
 * @Description:
 *
 */
import { ServerUnaryCall } from '@grpc/grpc-js';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const ctx = executionContext.switchToRpc();
    // const data = ctx.getData();
    const metadata = ctx.getContext();

    const serverUnaryCallImpl = executionContext.getArgByIndex(
      2,
    ) as ServerUnaryCall<any, any>;

    const path = serverUnaryCallImpl.getPath();

    const requestTime = Date.now();

    // Add request time to params to be used in exception filters
    metadata.requestTime = requestTime.toString();

    return next.handle().pipe(
      tap(() => {
        this.logger.log(
          `${path} ${Date.now() - requestTime}ms`,
          GrpcLoggingInterceptor.name,
        );
      }),
    );
  }
}
