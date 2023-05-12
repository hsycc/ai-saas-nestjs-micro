/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-11 08:21:18
 * @Description:
 *
 */
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Controller, Inject, Delete, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  USER_SERVICE_NAME,
  UserModel,
  UserServiceClient,
} from '@proto/gen/user.pb';

import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto';
import { ApiBaseResponse, BaseApiExtraModels } from '@lib/swagger';
import { Auth } from './decorators/auth.decorator';

@ApiTags('auth')
@Controller('auth')
@BaseApiExtraModels(AccessTokenDto)
export class AuthController {
  private svc: UserServiceClient;
  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
    private readonly authService: AuthService,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  // TODO: save token in redis
  /**
   * 渠道用户登录
   */
  @Put('login')
  @Auth('local')
  private async login(@Req() req: Request) {
    return this.authService.login(req.user as UserModel);
  }

  // TODO: delete token in redis
  /**
   * 渠道用户登出
   */
  @Delete('logout')
  @Auth('jwt')
  @ApiBaseResponse()
  private async logout() {
    // return 'logout';
  }
}
