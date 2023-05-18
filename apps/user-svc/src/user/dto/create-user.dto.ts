/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:28:43
 * @LastEditTime: 2023-05-18 15:00:20
 * @Description:
 *
 */
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CreateUserRequest } from '@proto/gen/user.pb';

export class CreateUserDto implements CreateUserRequest {
  /**
   * @example hsycc123
   */
  @IsString()
  @IsNotEmpty()
  username: string;

  /**
   * @example 12345678
   */
  @IsString()
  @Length(8)
  password: string;
}
