/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-11 05:20:03
 * @Description:
 *
 */

import { UserStatusEnum, UserRolesEnum, UserModel } from '@proto/gen/user.pb';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
export class UserEntity implements UserModel {
  /** id */
  id: string;
  /** 用户名 */
  username: string;
  /** 头像 */
  avatar: string;
  /**
   * 状态 0: 停用; 1: 启用; -1: 未知;
   * @example 1
   * @default 1
   * @enum [0, 1, -1]
   * */
  status: UserStatusEnum;

  /**
   * 角色  0: 管理员 ; 1: 渠道用户; -1: 未知;
   * @example 0
   * @default 0
   * @enum [0, 1, -1]
   * */
  role: UserRolesEnum;
  /** 公钥 */
  accessKey: string;
  /** 创建时间 */
  createdAt: number;
  /** 修改时间 */
  updatedAt: number;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  secretKey: string;
}
