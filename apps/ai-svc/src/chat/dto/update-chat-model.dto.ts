/*
 * @Author: hsycc
 * @Date: 2023-05-11 05:26:24
 * @LastEditTime: 2023-05-18 23:04:39
 * @Description:
 *
 */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdateChatModelRequest } from '@proto/gen/ai.pb';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { CreateChatModelDto } from './create-chat-model.dto';

export class UpdateChatModelDto
  extends PickType(CreateChatModelDto, ['struct'] as const)
  implements UpdateChatModelRequest
{
  @IsString()
  @IsNotEmpty()
  id: string;

  /**
   * @example 菜提猫
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  name?: string;

  /**
   * @example %question%
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  questionTpl?: string;
}
