/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:24
 * @LastEditTime: 2023-05-10 08:15:43
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
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UserModel,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import {
  CreateUserDto,
  UpdateUserPublicDto,
  UpdateUserPrivateDto,
} from '@app/user-svc/user/dto';
import { UserEntity } from '@app/user-svc/user/entities/user.entity';
import {
  ApiBaseResponse,
  ApiListResponse,
  ApiObjResponse,
  BaseApiExtraModels,
} from '@lib/swagger';
import { AkSkUtil } from '@lib/common';

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
   * 注册渠道用户, 需要做 权限控制
   */
  @Post('register')
  @ApiObjResponse(UserEntity)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Observable<UserModel>> {
    return this.svc.createUser(createUserDto, new Metadata());
  }
  /**
   * 更新渠道用户的状态, 需要做 权限控制
   */
  @Patch('update_security')
  @ApiBaseResponse()
  private async updateSecurity(
    @Body() updateUserPrivateDto: UpdateUserPrivateDto,
  ) {
    return this.svc.updateUser(updateUserPrivateDto, new Metadata());
  }

  /**
   * 获取渠道用户,需要做 权限控制
   */
  @Get('list')
  @ApiListResponse(UserEntity)
  private async userList() {
    return this.svc.getUserModelList({}, new Metadata());
  }

  /**
   * 获取当前登录状态下渠道用户的信息, 需要 accessToken
   */
  @Get('current')
  @ApiObjResponse(UserEntity)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  private async current(@CurrentUser() id) {
    return this.svc.getUserById({ id }, new Metadata());
  }

  /**
   * 更新用户信息, 需要 accessToken
   */
  @Patch('update')
  @ApiBaseResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  private async update(
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
   * 更新用户密钥对 需要 accessToken
   */
  @Patch('update_keys')
  @ApiBaseResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  private async updateKeys(@CurrentUser() id) {
    return this.svc.updateUser(
      {
        id,
        ...AkSkUtil.generateKeys(),
      },
      new Metadata(),
    );
  }
}
