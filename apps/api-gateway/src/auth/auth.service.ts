/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-29 07:02:49
 * @Description:
 *
 */
import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { compareSync } from 'bcrypt';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UserModel,
  GRPC_USER_V1_PACKAGE_NAME,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

import { JwtPayload } from './interface';
@Injectable()
export class AuthService {
  constructor(
    @Inject(GRPC_USER_V1_PACKAGE_NAME)
    private readonly clients: ClientGrpc[],
    private readonly jwtService: JwtService,
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

  async validateAccessKey(accessKey: string): Promise<UserModel | null> {
    try {
      const user = await lastValueFrom(
        this.userServiceClient.getUserByAccessKey(
          { accessKey },
          new Metadata(),
        ),
      );
      // 散列密码 校验
      if (user && accessKey === user.accessKey) {
        return user;
      }
      return null;
    } catch (error) {}
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserModel | null> {
    try {
      const user = await lastValueFrom(
        this.userServiceClient.getUserByName({ username }, new Metadata()),
      );
      // 散列密码 校验
      if (user && compareSync(pass, user.password)) {
        return user;
      }
      return null;
    } catch (error) {}
  }

  async login(user) {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
