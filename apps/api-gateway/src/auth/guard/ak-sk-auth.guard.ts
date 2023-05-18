/*
 * @Author: hsycc
 * @Date: 2023-05-08 06:16:06
 * @LastEditTime: 2023-05-18 20:22:19
 * @Description: 封装AuthGuard,方便维护
 *
 */
import { Request } from 'express';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { CONSTANT_SKIP_AUTH } from '../decorators/auth.decorator';
import Utils from '@lib/common/utils/helper';
import { CONSTANT_X_AUTHORIZATION } from '@lib/common';

@Injectable()
export class AkSkAuthGuard extends AuthGuard('ak/sk') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(executionContext: ExecutionContext) {
    const ctx = executionContext.switchToHttp();

    const req = ctx.getRequest<Request>();

    const skipAuth = this.reflector.getAllAndOverride<boolean>(
      CONSTANT_SKIP_AUTH,
      [executionContext.getHandler(), executionContext.getClass()],
    );
    if (
      skipAuth &&
      Utils.isDev &&
      !req.headers[CONSTANT_X_AUTHORIZATION] &&
      !req.query[CONSTANT_X_AUTHORIZATION]
    ) {
      return true;
    }
    return super.canActivate(executionContext);
  }
}
