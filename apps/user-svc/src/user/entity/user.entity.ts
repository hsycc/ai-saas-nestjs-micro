/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-05 23:55:59
 * @Description:
 *
 */
import { User, UserRole, UserStatus } from '.prisma/user-client';
import { getAesInstance } from '@app/common/utils';
export class UserEntity implements User {
  /**
   * id
   */
  id: number;

  /**
   * 用户名
   */
  username: string;

  /**
   * 头像
   */
  avatar: string;

  /**
   * 密码
   */
  set password(pwd: string) {
    this.password = pwd;
  }

  /**
   * 用户状态
   * @enum UserStatus
   */
  status: UserStatus;

  /**
   * 角色
   */
  role: UserRole;

  /**
   * 公钥
   */
  public_key: string;

  /**
   * 私钥
   */
  set private_key(key: string) {
    this.private_key = getAesInstance(2).encrypt(key);
  }

  /**
   * 创建时间
   */
  createdAt: Date;

  /**
   * 修改时间
   */
  updatedAt: Date;
}
