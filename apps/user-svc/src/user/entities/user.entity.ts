/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-08 07:36:41
 * @Description:
 *
 */

import { hashSync, genSaltSync } from 'bcrypt';
import { User } from '.prisma/user-client';
import { getAesInstance } from '@app/common/utils';

import { UserStatusEnum, UserRolesEnum } from '@proto/gen/user.pb';
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

  /** password */
  set password(pwd: string) {
    this.password = hashSync(pwd, genSaltSync(10));
  }
  /** 私钥 */
  set secretKey(key: string) {
    this.secretKey = key ? getAesInstance(2).encrypt(key) : '';
  }
}
