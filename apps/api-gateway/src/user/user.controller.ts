/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:24
 * @LastEditTime: 2023-05-08 07:38:09
 * @Description:
 *
 */
import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Get,
  Post,
  Patch,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UserModel,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

import { CreateUserRequestDto } from 'apps/user-svc/src/user/dto/user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'apps/user-svc/src/user/entities/user.entity';
@ApiTags('user')
@Controller('user')
@ApiExtraModels(UserEntity)
export class UserController implements OnModuleInit {
  private svc: UserServiceClient;

  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  /**
   * 注册渠道用户
   */
  @Post('register')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  private async register(
    @Body() body: CreateUserRequestDto,
  ): Promise<Observable<UserModel>> {
    return this.svc.createUser(body, new Metadata());
  }

  /**
   * 获取当前登录状态下渠道用户的信息
   */
  @Get('current')
  private async current() {
    const user = await lastValueFrom(
      this.svc.getUserById(
        {
          id: 'clhcwl1ybq000uau9t67z8xj0',
        },
        new Metadata(),
      ),
    );
    console.log(typeof user.avatar);
    console.log(typeof user.status);
    console.log(typeof user.createdAt);
    // delete user.test;
    console.log(user);
    return user;
  }

  /**
   * 更新用户信息
   */
  @Patch('update')
  @ApiBearerAuth()
  private async Update() {
    //
  }

  /**
   * 创建密钥对
   */
  @Post('create_keys')
  @ApiBearerAuth()
  private async createKeys() {
    //
  }
}
