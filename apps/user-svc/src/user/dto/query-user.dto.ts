/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-18 15:01:08
 * @Description:
 *
 */
import { IsNotEmpty, IsString } from 'class-validator';
import {
  QueryUserByAccessKeyRequest,
  QueryUserByIdRequest,
  QueryUserByNameRequest,
} from '@proto/gen/user.pb';
export class QueryUserByIdDto implements QueryUserByIdRequest {
  /**
   * @example clhcsprq10000uawc05bf2whi
   */
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class QueryUserByNameDto implements QueryUserByNameRequest {
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class QueryUserByAccessKeyDto implements QueryUserByAccessKeyRequest {
  @IsString()
  @IsNotEmpty()
  accessKey: string;
}
