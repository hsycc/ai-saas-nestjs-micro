/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-10 08:16:08
 * @Description:
 *
 */
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Controller, Inject, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

import {
  USER_SERVICE_NAME,
  UserModel,
  UserServiceClient,
} from '@proto/gen/user.pb';

import { AuthService } from './auth.service';
import { AccessTokenDto, LoginAuthDto } from './dto';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import {
  ApiBaseResponse,
  ApiObjResponse,
  BaseApiExtraModels,
} from '@lib/swagger';

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

  /**
   * 渠道用户登录
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginAuthDto })
  @ApiObjResponse(AccessTokenDto)
  private async login(@Req() req: Request) {
    return this.authService.login(req.user as UserModel);
  }

  /**
   * 渠道用户登出
   */
  @Put('logout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBaseResponse()
  private async logout() {
    return 'logout';
    //
  }
}
