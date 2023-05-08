/*
 * @Author: hsycc
 * @Date: 2023-05-08 07:16:21
 * @LastEditTime: 2023-05-08 08:03:50
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
   * @example 123456
   **/
  @IsString()
  @MinLength(8)
  public readonly password: string;
}
