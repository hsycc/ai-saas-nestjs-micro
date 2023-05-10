/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-10 05:26:46
 * @Description:
 *
 */
import { IsString } from 'class-validator';
import {
  QueryUserByIdRequest,
  QueryUserByNameRequest,
} from '@proto/gen/user.pb';
export class QueryUserByIdDto implements QueryUserByIdRequest {
  /**
   * @example clhcsprq10000uawc05bf2whi
   */
  @IsString()
  id: string;
}
export class QueryUserByNameDto implements QueryUserByNameRequest {
  @IsString()
  username: string;
}
