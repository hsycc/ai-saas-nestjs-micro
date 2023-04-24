import { Metadata } from '@grpc/grpc-js';
/*
 * 全局过滤器 - 处理错误信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-24 14:53:49
 * @Description:
 *
 */
import { Request, Response } from 'express';
import {
  LoggerService,
  ArgumentsHost,
  Catch,
  HttpStatus,
  HttpException,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
  ExceptionFilter,
} from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch()
export class ApiGatewayExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    console.log(exception.name);
    console.log(exception.Metadata);
    // console.log(exception);
    for (const key in exception) {
      if (Object.prototype.hasOwnProperty.call(exception, key)) {
        const element = exception[key];
        console.log(key, element);
      }
    }

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // throwError(() => exception);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      data: 'xx',
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message ? exception.message : exception,
    });
  }
}
