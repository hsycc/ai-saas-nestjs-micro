/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-10 04:56:43
 * @Description:
 *
 */

import { User } from '.prisma/user-client';

import { UserStatusEnum, UserRolesEnum } from '@proto/gen/user.pb';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class UserEntity implements User {
  /** id */
  id: string;
  /** 用户名 */
  username: string;
  /** 头像 */
  avatar: string;
  /** 用户状态 */
  status: UserStatusEnum;
  /** 角色 */
  role: UserRolesEnum;
  /** 公钥 */
  accessKey: string;
  /** 创建时间 */
  createdAt: Date;
  /** 修改时间 */
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  secretKey: string;
}
