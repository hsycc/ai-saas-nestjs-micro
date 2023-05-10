/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-10 07:06:20
 * @Description:
 *
 */

import { PickType } from '@nestjs/swagger';
import {
  UpdateUserRequest,
  UserRolesEnum,
  UserStatusEnum,
} from '@proto/gen/user.pb';

// omit
export class UpdateUserDto implements UpdateUserRequest {
  /**
   * @example clhcsprq10000uawc05bf2whi
   */
  id: string;
  /**
   * @example xxxxx
   */
  avatar?: string;

  /**
   * @example 12345678
   */
  password?: string;
  status?: UserStatusEnum;
  role?: UserRolesEnum;
  accessKey?: string;
  secretKey?: string;
}
export class UpdateUserPublicDto extends PickType(UpdateUserDto, [
  'avatar',
  'password',
] as const) {}

export class UpdateUserPrivateDto extends PickType(UpdateUserDto, [
  'id',
  'role',
  'status',
] as const) {}
