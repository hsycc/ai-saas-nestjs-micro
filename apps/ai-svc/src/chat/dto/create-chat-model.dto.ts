/*
 * @Author: hsycc
 * @Date: 2023-05-11 05:26:11
 * @LastEditTime: 2023-05-18 23:05:12
 * @Description:
 *
 */
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { CreateChatModelRequest } from '@proto/gen/ai.pb';
import { Type } from 'class-transformer';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { ChatModelEntity } from '../entities/chat-model.entity';

export class CreateChatModelDto
  extends PickType(ChatModelEntity, ['struct'] as const)
  implements CreateChatModelRequest
{
  @ApiProperty({
    example: null,
    default: 'chatgpt',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  provider?: string;

  @ApiProperty({
    example: null,
    default: 'gpt-3.5-turbo',
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

  @ApiProperty({
    example: '菜提猫',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: null,
    default: '%question%',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  questionTpl?: string;
}
