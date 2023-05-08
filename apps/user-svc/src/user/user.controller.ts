/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-08 07:27:41
 * @Description:
 *
 */
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateUserRequestDto,
  QueryUserByIdRequestDto,
  UpdateUserRequestDto,
  QueryUserByNameRequestDto,
} from './dto/user.dto';
import {
  USER_SERVICE_NAME,
  UserModel,
  UserModelList,
} from '@proto/gen/user.pb';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
  ) {}

  @GrpcMethod(USER_SERVICE_NAME, 'CreateUser')
  private register(payload: CreateUserRequestDto): Promise<UserModel | any> {
    return this.service.createUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'DeleteUser')
  private deleteUser(payload: QueryUserByIdRequestDto): Promise<void> {
    return this.service.deleteUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'UpdateUser')
  private updateUser(payload: UpdateUserRequestDto): Promise<void> {
    return this.service.updateUser(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserById')
  private getUserById(payload: QueryUserByIdRequestDto): Promise<UserModel> {
    return this.service.getUserById(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserByName')
  private getUserByName(
    payload: QueryUserByNameRequestDto,
  ): Promise<UserModel> {
    return this.service.getUserByName(payload);
  }

  @GrpcMethod(USER_SERVICE_NAME, 'GetUserModelList')
  private getUserModelList(): Promise<UserModelList> {
    return this.service.getUserModelList();
  }
}
