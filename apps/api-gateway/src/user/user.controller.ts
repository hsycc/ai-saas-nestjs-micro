import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  LoginResponse,
  RegisterResponse,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

import {
  LoginRequestDto,
  RegisterRequestDto,
} from 'apps/user-svc/src/user/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from '../common/guards/user-auth.guard';
@ApiTags('user')
@Controller('user')
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
  // @UseGuards(UserAuthGuard)
  private async register(
    @Body() body: RegisterRequestDto,
  ): Promise<Observable<RegisterResponse>> {
    return this.svc.register(body, new Metadata());
  }

  /**
   * 渠道用户登录
   */
  @Put('login')
  private async login(
    @Body() body: LoginRequestDto,
  ): Promise<Observable<LoginResponse>> {
    return this.svc.login(body, new Metadata());
  }

  /**
   * 渠道用户退出
   */
  @Delete('logout')
  private async logout() {
    //
  }

  /**
   * 获取当前渠道用户的信息
   */
  @Get('current')
  private async current() {
    //
  }

  /**
   * 创建密钥对
   */
  @Post('create_keys')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  private async createKeys() {
    //
  }

  /**
   * 重置密钥对
   */
  @Post('update_keys')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  private async updateKeys() {
    //
  }
}
