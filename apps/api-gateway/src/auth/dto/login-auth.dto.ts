/*
 * @Author: hsycc
 * @Date: 2023-05-08 07:16:21
 * @LastEditTime: 2023-05-10 06:58:01
 * @Description:
 *
 */

import { IsString, MinLength } from 'class-validator';
export class LoginAuthDto {
  /**
   * @example hsycc
   **/
  @IsString()
  username: string;

  /**
   * @example 12345678
   **/
  @IsString()
  @MinLength(8)
  public readonly password: string;
}
