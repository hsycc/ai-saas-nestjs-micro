/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-10 02:53:27
 * @Description:
 *
 */

import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  USER_SERVICE_NAME,
  UserModel,
  UserModelList,
} from '@proto/gen/user.pb';
import { UserService } from './user.service';
import {
  CreateUserDto,
  QueryUserByIdDto,
  UpdateUserDto,
  QueryUserByNameDto,
} from './dto';

@Controller()
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
  ) {}

  @GrpcMethod(USER_SERVICE_NAME, 'createUser')
  private register(payload: CreateUserDto): Promise<UserModel | any> {
    return this.service.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'deleteUser')
  private deleteUser(payload: QueryUserByIdDto): Promise<void> {
    return this.service.deleteUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'updateUser')
  private updateUser(payload: UpdateUserDto): Promise<void> {
    return this.service.updateUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserById')
  private getUserById(payload: QueryUserByIdDto): Promise<UserModel> {
    return this.service.getUserById(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserByName')
  private getUserByName(payload: QueryUserByNameDto): Promise<UserModel> {
    return this.service.getUserByName(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'getUserModelList')
  private getUserModelList(): Promise<UserModelList> {
    return this.service.getUserModelList();
  }
}
