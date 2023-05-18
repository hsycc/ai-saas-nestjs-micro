/*
 * @Author: hsycc
 * @Date: 2023-05-10 02:29:04
 * @LastEditTime: 2023-05-18 22:56:36
 * @Description:
 *
 */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  QueryChatModelByIdRequest,
  QueryChatModelListRequest,
} from '@proto/gen/ai.pb';

export class QueryChatModelByIdDto implements QueryChatModelByIdRequest {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class QueryChatModelListDto implements QueryChatModelListRequest {
  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsNumber()
  pageSize?: number;
}
