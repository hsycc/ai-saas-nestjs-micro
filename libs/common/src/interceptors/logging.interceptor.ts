/*
 * 为请求统一打上时间戳, 日志拦截器
 * @Author:
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-22 17:00:06
 * @Description:
 *
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  LoggerService,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const method = request.method;
    const url = request.url;

    const requestTime = Date.now();

    // Add request time to params to be used in exception filters
    request.params.requestTime = requestTime.toString();

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${method} ${url} - ${response.statusCode} - ${
              Date.now() - requestTime
            }ms`,
            LoggingInterceptor.name,
          ),
        ),
      );
  }
}
