/*
 * 本地化登录 认证策略
 * @Author: hsycc
 * @Date: 2023-05-08 06:10:42
 * @LastEditTime: 2023-05-30 01:22:10
 * @Description:
 *
 */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    private readonly authService: AuthService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUser(username, password);
    if (!user) {
      // TODO: check use-svc 服务是否在线
      throw new UnauthorizedException();
    }
    return user;
  }
}
