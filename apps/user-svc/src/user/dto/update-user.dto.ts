/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-11 05:38:53
 * @Description:
 *
 */

import { PickType } from '@nestjs/swagger';
import {
  UpdateUserRequest,
  UserRolesEnum,
  UserStatusEnum,
} from '@proto/gen/user.pb';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

// omit
export class UpdateUserDto implements UpdateUserRequest {
  /**
   * @example clhcsprq10000uawc05bf2whi
   */
  id: string;
  /**
   * @example xxxxx
   */
  @IsOptional()
  @IsString()
  @Type(() => String)
  avatar?: string;

  /**
   * @example 12345678
   */
  @IsOptional()
  @IsString()
  @Type(() => String)
  password?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: UserStatusEnum;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  role?: UserRolesEnum;

  @IsOptional()
  @IsString()
  @Type(() => String)
  accessKey?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
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
