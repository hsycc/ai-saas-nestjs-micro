/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-08 09:00:15
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, lastValueFrom } from 'rxjs';

import { compareSync } from 'bcrypt';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UserModel,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface';
import { UserEntity } from 'apps/user-svc/src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private svc: UserServiceClient;

  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
    private readonly jwtService: JwtService,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async validateToken(
    accessToken: string,
  ): Promise<Observable<UserModel>> {
    // return this.svc.validateToken({ accessToken }, new Metadata());
    let a;
    return a as any;
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserModel | null> {
    try {
      const user = await lastValueFrom(
        this.svc.getUserByName({ username }, new Metadata()),
      );
      // 散列密码 校验
      if (user && compareSync(pass, user.password)) {
        return user;
      }
      return null;
    } catch (error) {}
  }

  async login(user: UserEntity) {
    const payload: JwtPayload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
