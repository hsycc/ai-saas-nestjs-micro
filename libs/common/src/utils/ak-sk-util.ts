/*
 * ak/sk 工具函数
 * @Author: hsycc
 * @Date: 2023-05-09 06:50:25
 * @LastEditTime: 2023-05-09 23:14:30
 * @Description:
 *
 */
import * as Crypto from 'crypto';

export interface Keys {
  accessKey: string;
  secretKey: string;
}

export class AkSkUtil {
  public static generateRandomString(length = 20): string {
    return Crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }
  public static generateKeys(): Keys {
    return {
      accessKey: this.generateRandomString(20),
      secretKey: this.generateRandomString(40),
    };
  }
}
