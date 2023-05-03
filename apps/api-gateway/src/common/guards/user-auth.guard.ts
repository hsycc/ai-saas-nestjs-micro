import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { ValidateResponse } from '@proto/gen/user.pb';
import { UserService } from '../../user/user.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    @Inject(UserService)
    public readonly service: UserService,
  ) {}
  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
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
      const res = await lastValueFrom(await this.service.validate(token));

      req.user = res.userId;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
