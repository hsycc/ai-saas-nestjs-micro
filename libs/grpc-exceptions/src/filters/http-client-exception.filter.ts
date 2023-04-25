/*
 * 全局过滤器 - 处理错误信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-25 14:55:23
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
  ExceptionFilter,
  BadRequestException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpClientExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: string = 'api-gateway',
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
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
    this.logger.log(
      `${method} ${url} - ${status} - ${Date.now() - requestTime}ms`,
      'Access',
    );

    const errRes = exception.getResponse() as any;

    const stackTop = exception.stack
      .split('\n')[1]
      ?.split('at ')[1]
      ?.split(' ')[0];

    this.logger.error(
      JSON.stringify(errRes?.message),
      stackTop,
      HttpClientExceptionFilter.name,
    );

    this.logger.error(
      `${req.originalUrl}`,
      req.rawHeaders.toString(),
      HttpClientExceptionFilter.name,
    );
    this.logger.error(
      `request payload:`,
      JSON.stringify({
        params: req.params,
        query: req.query,
        body: req.body,
      }),
      HttpClientExceptionFilter.name,
    );

    // 网关直接抛出 HttpException 相关
    if (exception instanceof BadRequestException) {
      // api-gateway dto body validationPipe throwError
      return res.status(status).json({
        statusCode: status,
        code: 600,
        message: errRes?.message?.message || errRes?.message,
        service: errRes?.message?.service || this.service,
        meta: errRes?.message?.meta || errRes?.meta,
      });
    }

    // svc grpc throw rcpException
    // if (status == HttpStatus.UNAUTHORIZED) {
    //   // 未授权
    // } else if (status == HttpStatus.FORBIDDEN) {
    //   // 禁止访问
    // } else
    if (status == HttpStatus.UNPROCESSABLE_ENTITY) {
      // svc dto body validationPipe throwError
      return res.status(status).json({
        statusCode: status,
        code: errRes?.message?.code || 601,
        message: errRes?.message?.message,
        service: errRes?.message?.service,
        meta: errRes?.message?.meta,
      });
    } else {
      /* 其他异常 */
      return res.status(status).json({
        statusCode: status,
        code: errRes?.message?.code || -1,
        message: errRes?.message?.message || errRes?.message,
        service: errRes?.message?.service || this.service,
      });
    }
  }
}
