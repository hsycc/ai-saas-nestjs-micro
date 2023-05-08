/*
 * @Author: hsycc
 * @Date: 2023-04-26 14:31:13
 * @LastEditTime: 2023-05-08 07:41:23
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  UserServiceClient,
  USER_SERVICE_NAME,
  UserModel,
} from '@proto/gen/user.pb';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class UserService {
  private svc: UserServiceClient;

  constructor(
    @Inject(USER_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.svc = this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  public async validate(username): Promise<Observable<UserModel>> {
    return this.svc.getUserByName({ username }, new Metadata());
  }
}
