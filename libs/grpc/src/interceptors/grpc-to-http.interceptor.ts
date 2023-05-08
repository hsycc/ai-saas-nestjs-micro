/*
 * 拦截器:
 * grpc-server 封装RpcException异常错误抛出 http-client
 * @Author: hsycc
 * @Date: 2023-04-24 15:19:42
 * @LastEditTime: 2023-04-26 18:12:59
 * @Description:
 *
 */
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HTTP_CODE_FROM_GRPC } from '../utils';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}
  intercept(
    _context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          !(
            typeof err === 'object' &&
            'details' in err &&
            err.details &&
            typeof err.details === 'string'
          )
        ) {
          return throwError(() => err);
        }

        const exception = JSON.parse(err.details) as {
          error: string | object;
          type: string;
          exceptionName: string;
        };

        if (exception.exceptionName !== RpcException.name) {
          return throwError(() => err);
        }

        const statusCode =
          HTTP_CODE_FROM_GRPC[err.code] || HttpStatus.INTERNAL_SERVER_ERROR;

        return throwError(
          () =>
            new HttpException(
              {
                message: exception.error,
                statusCode,
                error: HttpStatus[statusCode],
              },
              statusCode,
              {
                cause: err,
              },
            ),
        );
      }),
    );
  }
}
