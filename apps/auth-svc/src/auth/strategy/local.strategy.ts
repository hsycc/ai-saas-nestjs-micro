import { PassportStrategy } from '@nestjs/passport';

import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

// import { ContextIdFactory, ModuleRef } from '@nestjs/core';  // 动态范围写法

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    // private moduleRef: ModuleRef, //  动态范围写法
    private readonly authService: AuthService,
  ) {
    super({
      // passReqToCallback: true, //  动态范围写法
    });
  }
  async validate(
    // request: Request,  // 动态范围写法
    username: string,
    password: string,
  ) {
    // 动态范围写法
    // const contextId = ContextIdFactory.getByRequest(request);
    // const authService = await this.moduleRef.resolve(AuthService, contextId);
    // const user = await authService.validateUser(username, password);

    const user = await this.authService.validateUser(username, password);
    // if (!user) {
    //   throw new AppError(AppErrorTypeEnum.USER_NOT_FOUND);
    // }

    return user;
  }
}
