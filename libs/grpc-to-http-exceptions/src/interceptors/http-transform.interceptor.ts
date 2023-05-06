/*
 * 拦截器:
 * http-client 统一请求成功的返回数据
 * @Author: hsycc
 * @Date: 2023-04-22 15:42:43
 * @LastEditTime: 2023-05-06 09:05:40
 * @Description:
 *
 */

import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus,
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
        // 覆盖 20* 的状态码
        context.switchToHttp().getResponse().status(HttpStatus.OK);
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
