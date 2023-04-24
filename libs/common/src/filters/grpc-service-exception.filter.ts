import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  RpcExceptionFilter,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { type } from 'os';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    // console.log(exception.name, exception);

    const hostType = host.getType();
    console.log('hostType', hostType);

    const ctx = host.switchToRpc();
    const data = ctx.getData();
    const context = ctx.getContext();

    if (exception instanceof UnauthorizedException) {
      /* 未授权异常 */
      console.log(
        '未授权异常',
        exception.message,
        exception.getResponse(),
        exception.getStatus(),
      );

      const a = new RpcException(new UnauthorizedException());
      return new UnauthorizedException();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return {
        statusCode: 401,
        data: 124,
      };
    } else if (exception instanceof ForbiddenException) {
      /* 权限验证异常 */
      return {};
    } else if (exception instanceof BadRequestException) {
    } else {
      // 其他情况
    }

    // return new Error('xxx');

    const returnData = {
      code: 2001,
      msg: 222,
    };

    return new ForbiddenException('xxxx');
    return returnData;

    return new RpcException({
      code: 2001,
      msg: 222,
    });

    // return new RpcException('xxxxx');
  }
}
