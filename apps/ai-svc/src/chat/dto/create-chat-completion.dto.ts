/*
 * @Author: hsycc
 * @Date: 2023-05-15 12:58:48
 * @LastEditTime: 2023-05-18 20:14:37
 * @Description:
 *
 */

import { IsValidChatCompletionMessages } from '@lib/common/validators/is-valid-chat-completion-messages';
import { ApiProperty } from '@nestjs/swagger';
import { CreateChatCompletionRequest } from '@proto/gen/ai.pb';
import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEnum,
  Validate,
} from 'class-validator';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';

export class ChatCompletionRequestMessageDto
  implements ChatCompletionRequestMessage
{
  @ApiProperty({
    type: ChatCompletionRequestMessageRoleEnum,
    enum: ChatCompletionRequestMessageRoleEnum,
    // examples: ChatCompletionRequestMessageRoleEnum,
    description: 'The role of the author of this message.',
  })
  @IsNotEmpty()
  @IsString()
  @IsEnum(ChatCompletionRequestMessageRoleEnum)
  role: ChatCompletionRequestMessageRoleEnum;

  @ApiProperty({
    example: 'jack',
    description: 'The name of the user in a multi-user chat',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '你是一只猫',
    description: 'The contents of the message',
  })
  content: string;
}
export class CreateChatCompletionDto implements CreateChatCompletionRequest {
  @ApiProperty({
    description: '会话模型id, 为空不设置聊天会话风格',
    example: 'clht05un60000uam8fc8pdcpz',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public chaModelId?: string;

  @ApiProperty({
    example: '你好啊,给我讲个笑话',
    description: ' 提问的问题文本',
  })
  @IsNotEmpty()
  @IsString()
  public question: string;

  @ApiProperty({
    type: [ChatCompletionRequestMessageDto],
    description: '会话上下文',
    required: false,
    example: [
      {
        role: 'user',
        content: '给我讲个笑话',
        // name? 多人会话聊天区分发言人
      },
      {
        role: 'assistant',
        content:
          '好的！这是一个餐馆的笑话。顾客来到餐馆里点了一份牛排，可是吃了半天却咬不动它，就把服务员叫了过来。服务员查看后发现这是因为牛排的内部太老了。于是他说：“别担心，我去问一下，也许我们还有别的老牛排。”（笑）',
      },
    ],
  })
  @IsOptional()
  @Validate(IsValidChatCompletionMessages) // 约束 messages 结构
  public messages: ChatCompletionRequestMessage[];
}
