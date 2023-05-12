/*
 * @Author: hsycc
 * @Date: 2023-05-11 05:26:11
 * @LastEditTime: 2023-05-11 18:59:26
 * @Description:
 *
 */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CreateChatModelRequest } from '@proto/gen/ai.pb';
import { Exclude, Type } from 'class-transformer';
import { ApiHideProperty, ApiProperty, PickType } from '@nestjs/swagger';
import { ChatModelEntity } from '../entities/chat-model.entity';

export class CreateChatModelDto
  extends PickType(ChatModelEntity, ['struct'] as const)
  implements CreateChatModelRequest
{
  @ApiHideProperty()
  @Exclude()
  userId: string;

  @ApiProperty({
    example: null,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  provider?: string;

  @ApiProperty({
    example: null,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Transform(({ value, obj }: TransformFnParams) => {
    // provider 值为 null, 强制 model == null
    if (obj.provider === null) {
      return null;
    }
    return value;
  })
  model?: string;

  /**
   * @example 菜提猫
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: null,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  questionTpl?: string;
}
