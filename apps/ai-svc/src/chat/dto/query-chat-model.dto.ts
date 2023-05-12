/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-11 14:54:19
 * @Description:
 *
 */
import { IsString } from 'class-validator';
import {
  QueryChatModelByIdRequest,
  QueryChatModelListRequest,
} from '@proto/gen/ai.pb';

export class QueryChatModelByIdDto implements QueryChatModelByIdRequest {
  @IsString()
  id: string;

  /**
   * @example clhcsprq10000uawc05bf2whi
   */
  @IsString()
  userId: string;
}

export class QueryChatModelListDto implements QueryChatModelListRequest {
  userId: string;
  current?: number;
  pageSize?: number;
}
