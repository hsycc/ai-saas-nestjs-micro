/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:44
 * @LastEditTime: 2023-05-08 07:42:56
 * @Description:
 *
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { UserModel } from '@proto/gen/user.pb';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../auth.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService)
    public readonly service: AuthService,
  ) {}
  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    console.log('JwtAuthGuard, ');

    const req: Request = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    // 获取用户id 同时挂载到 req.user 上面

    try {
      const res: UserModel = await lastValueFrom(
        await this.service.validateToken(token),
      );

      req.user = res.id;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
