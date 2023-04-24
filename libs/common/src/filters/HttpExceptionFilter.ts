/*
 * 全局过滤器 - 处理错误信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-24 15:15:56
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
} from '@nestjs/common';

import { ExceptionFilter } from '@nestjs/common/interfaces/exceptions';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception, 33);

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    // Get the location where the error was thrown from to use as a logging tag
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const method = req.method;
    const url = req.url;
    const requestTime = Number(req.params.requestTime) || 0;
    if (exception.stack) {
      const stackTop = exception.stack
        .split('\n')[1]
        ?.split('at ')[1]
        ?.split(' ')[0];
      this.logger.log(
        `${method} ${url} - ${status} - ${Date.now() - requestTime}ms`,
        'Access',
      );
      this.logger.error(`${exception}`, stackTop, HttpExceptionFilter.name);
    }
    this.logger.error(
      `${req.originalUrl}`,
      req.rawHeaders.toString(),
      HttpExceptionFilter.name,
    );
    this.logger.error(
      `request payload:`,
      JSON.stringify({
        params: req.params,
        query: req.query,
        body: req.body,
      }),
      HttpExceptionFilter.name,
    );
    if (exception instanceof UnauthorizedException) {
      /* 未授权异常 */
      return res.status(HttpStatus.OK).json({
        data: null,
        code: HttpStatus.UNAUTHORIZED,
        message: exception.message,
      });
    } else if (exception instanceof ForbiddenException) {
      /* 权限验证异常 */
      return res.status(HttpStatus.OK).json({
        data: null,
        code: HttpStatus.FORBIDDEN,
        message: exception.message,
      });
    } else if (exception instanceof BadRequestException) {
      /* 参数验证异常, 如 `class-validator` 抛出的 */
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: exception.response.meta,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      });
    }
    // else if (exception instanceof AppError) {
    //   /* 自定义异常处理 */
    //   return res.status(exception.httpStatus).json({
    //     data: null,
    //     code: exception.errorCode,
    //     message: exception.errorMessage,
    //   });
    // }
    else {
      /* 其他异常 */
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: null,
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message ? exception.message : exception,
      });
    }
  }
}
