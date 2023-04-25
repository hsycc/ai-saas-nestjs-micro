/*
 * 拦截器:
 * http-client 统一请求成功的返回数据
 * @Author: hsycc
 * @Date: 2023-04-22 15:42:43
 * @LastEditTime: 2023-04-25 17:51:27
 * @Description:
 *
 */

import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
interface Response<T> {
  data: T;
}
@Injectable()
export class HttpTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: 200,
          code: 0,
          message: 'success',
          data,
        };
      }),
    );
  }
}
