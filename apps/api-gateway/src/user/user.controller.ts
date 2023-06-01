/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:24
 * @LastEditTime: 2023-06-02 06:49:12
 * @Description:
 *
 */
import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ServiceUnavailableException,
  Inject,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { ApiParam, ApiTags } from '@nestjs/swagger';

import {
  ApiBaseResponse,
  ApiListResponse,
  ApiObjResponse,
  BaseApiExtraModels,
} from '@lib/swagger';

import { generateKeyPair } from '@lib/common';

import {
  UserServiceClient,
  USER_SERVICE_NAME,
  GRPC_USER_V1_PACKAGE_NAME,
} from '@proto/gen/user.pb';

import {
  CreateUserDto,
  UpdateUserPublicDto,
  UpdateUserPrivateDto,
} from '@app/user-svc/user/dto';

import { UserEntity } from '@app/user-svc/user/entities/user.entity';

import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { GenerateClsMetadata } from '../auth/decorators/cls-metadata.decorator';

@ApiTags('user')
@Controller('user')
@BaseApiExtraModels(UserEntity)
export class UserController {
  constructor(
    @Inject(GRPC_USER_V1_PACKAGE_NAME)
    private readonly clients: ClientGrpc[],
  ) {}

  get userServiceClient(): UserServiceClient {
    // 软负载均衡
    if (this.clients.length === 0) {
      throw new ServiceUnavailableException();
    }
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex].getService<UserServiceClient>(
      USER_SERVICE_NAME,
    );
  }

  /**
   * 获取当前登录状态下渠道用户的信息
   */
  @Get('current')
  @Auth('jwt')
  @ApiObjResponse(UserEntity)
  private async current(
    @CurrentUser() id,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.getUserById({ id }, generateClsMetadata);
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
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.updateUser(
      {
        id,
        ...updateUserPublicDto,
      },
      generateClsMetadata,
    );
  }

  /**
   * 更新用户密钥对
   */
  @Patch('update_keys')
  @Auth('jwt')
  @ApiBaseResponse()
  private async updateKeys(
    @CurrentUser() id,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.updateUser(
      {
        id,
        ...generateKeyPair(),
      },
      generateClsMetadata,
    );
  }

  /**
   * 注册渠道用户, 权限控制未做
   */
  @Post('register')
  @ApiObjResponse(UserEntity)
  async register(
    @Body() createUserDto: CreateUserDto,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.createUser(
      createUserDto,
      generateClsMetadata,
    );
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
  private async deleteUser(
    @Param('id') id: string,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.deleteUser({ id }, generateClsMetadata);
  }

  /**
   * 更新渠道用户的状态, 权限控制未做
   */
  @Patch('update_security')
  @ApiBaseResponse()
  private async updateSecurity(
    @Body() updateUserPrivateDto: UpdateUserPrivateDto,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.updateUser(
      updateUserPrivateDto,
      generateClsMetadata,
    );
  }

  /**
   * 获取渠道用户列表,权限控制未做, 分页未做
   */
  @Get()
  @ApiListResponse(UserEntity)
  private async userList(@GenerateClsMetadata() generateClsMetadata) {
    return this.userServiceClient.getUserModelList({}, generateClsMetadata);
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
  private async getUserById(
    @Param('id') id: string,
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.userServiceClient.getUserById({ id }, generateClsMetadata);
  }
}
