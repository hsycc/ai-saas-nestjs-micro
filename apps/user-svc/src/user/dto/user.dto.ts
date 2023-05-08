/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-08 07:28:02
 * @Description:
 *
 */
import { IsString } from 'class-validator';
import {
  CreateUserRequest,
  QueryUserByIdRequest,
  UpdateUserRequest,
  UserRolesEnum,
  UserStatusEnum,
  QueryUserByNameRequest,
} from '@proto/gen/user.pb';

export class CreateUserRequestDto implements CreateUserRequest {
  username: string;
  password: string;
}

export class QueryUserByIdRequestDto implements QueryUserByIdRequest {
  @IsString()
  id: string;
}
export class QueryUserByNameRequestDto implements QueryUserByNameRequest {
  @IsString()
  username: string;
}
// TODO omit
export class UpdateUserRequestDto implements UpdateUserRequest {
  id: string;
  avatar?: string;
  password?: string;
  status?: UserStatusEnum;
  role?: UserRolesEnum;
  accessKey?: string;
  secretKey?: string;
}
