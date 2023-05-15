/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:24
 * @LastEditTime: 2023-05-15 15:41:41
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
  Delete,
  Patch,
  Param,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { ApiParam, ApiTags } from '@nestjs/swagger';

import { Metadata } from '@grpc/grpc-js';

import {
  ApiBaseResponse,
  ApiListResponse,
  ApiObjResponse,
  BaseApiExtraModels,
} from '@lib/swagger';

import { generateKeyPair } from '@lib/common';

import { UserServiceClient, USER_SERVICE_NAME } from '@proto/gen/user.pb';
import {
  CreateUserDto,
  UpdateUserPublicDto,
  UpdateUserPrivateDto,
} from '@app/user-svc/user/dto';
import { UserEntity } from '@app/user-svc/user/entities/user.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('user')
@Controller('user')
@BaseApiExtraModels(UserEntity)
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
   * 获取当前登录状态下渠道用户的信息
   */
  @Get('current')
  @Auth('jwt')
  @ApiObjResponse(UserEntity)
  private async current(@CurrentUser() id) {
    return this.svc.getUserById({ id }, new Metadata());
  }

  /**
   * 更新用户信息
   */
  @Patch('update')
  @Auth('jwt')
  @ApiBaseResponse()
  private async updateUser(
    @CurrentUser() id,
    @Body() updateUserPublicDto: UpdateUserPublicDto,
  ) {
    return this.svc.updateUser(
      {
        id,
        ...updateUserPublicDto,
      },
      new Metadata(),
    );
  }

  /**
   * 更新用户密钥对
   */
  @Patch('update_keys')
  @Auth('jwt')
  @ApiBaseResponse()
  private async updateKeys(@CurrentUser() id) {
    return this.svc.updateUser(
      {
        id,
        ...generateKeyPair(),
      },
      new Metadata(),
    );
  }

  /**
   * 注册渠道用户, 权限控制未做
   */
  @Post('register')
  @ApiObjResponse(UserEntity)
  async register(@Body() createUserDto: CreateUserDto) {
    return this.svc.createUser(createUserDto, new Metadata());
  }

  /**
   * 删除渠道,权限控制未做
   */
  @Delete('id')
  @ApiBaseResponse()
  @ApiParam({
    name: 'id',
    example: 'clhcsprq10000uawc05bf2whi',
  })
  private async deleteUser(@Param('id') id: string) {
    return this.svc.deleteUser({ id }, new Metadata());
  }

  /**
   * 更新渠道用户的状态, 权限控制未做
   */
  @Patch('update_security')
  @ApiBaseResponse()
  private async updateSecurity(
    @Body() updateUserPrivateDto: UpdateUserPrivateDto,
  ) {
    return this.svc.updateUser(updateUserPrivateDto, new Metadata());
  }

  /**
   * 获取渠道用户列表,权限控制未做, 分页未做
   */
  @Get()
  @ApiListResponse(UserEntity)
  private async userList() {
    return this.svc.getUserModelList({}, new Metadata());
  }

  /**
   * 获取渠道用户信息,权限控制未做
   */
  @Get('/:id')
  @ApiObjResponse(UserEntity)
  @ApiParam({
    name: 'id',
    example: 'clhcsprq10000uawc05bf2whi',
  })
  private async getUserById(@Param('id') id: string) {
    return this.svc.getUserById({ id }, new Metadata());
  }
}
