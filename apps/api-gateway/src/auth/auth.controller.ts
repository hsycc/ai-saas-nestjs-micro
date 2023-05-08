/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-08 09:50:41
 * @Description:
 *
 */
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Inject, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Metadata } from '@grpc/grpc-js';

import { USER_SERVICE_NAME, UserServiceClient } from '@proto/gen/user.pb';

import { ApiObjResponse } from '@app/common/decorators';
import { UserEntity } from 'apps/user-svc/src/user/entities/user.entity';

import { AuthService } from './auth.service';
import { AccessTokenDto, LoginAuthDto } from './dto';
import { CurrentUser } from './decorators/user.decorator';

@ApiExtraModels(ApiObjResponse)
@ApiTags('auth')
@Controller('auth')
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
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginAuthDto })
  @ApiObjResponse(AccessTokenDto)
  private async login(@Req() req: Request) {
    return this.authService.login(req.user as UserEntity);
  }

  /**
   * 渠道用户登出
   */
  @Put('logout')
  private async logout() {
    return 'logout';
    //
  }

  @Put('test')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  private async test(@CurrentUser() user) {
    console.log(user);

    return user;
    //
  }
}