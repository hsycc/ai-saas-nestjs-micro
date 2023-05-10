/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:28:43
 * @LastEditTime: 2023-05-10 02:36:23
 * @Description:
 *
 */
import { IsString, Length } from 'class-validator';
import { CreateUserRequest } from '@proto/gen/user.pb';

export class CreateUserDto implements CreateUserRequest {
  /**
   * @example hsycc123
   */
  @IsString()
  username: string;

  /**
   * @example 12345678
   */
  @Length(8)
  password: string;
}
