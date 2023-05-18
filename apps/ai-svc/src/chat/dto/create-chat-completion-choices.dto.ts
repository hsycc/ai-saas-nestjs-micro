/*
 * @Author: hsycc
 * @Date: 2023-05-18 23:38:44
 * @LastEditTime: 2023-05-19 00:50:53
 * @Description:
 *
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionChoicesResponse,
  CreateChatCompletionResponseChoicesInner,
} from '@proto/gen/ai.pb';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export class ChatCompletionRequestMessageDto
  implements ChatCompletionRequestMessage
{
  @ApiProperty({
    type: ChatCompletionRequestMessageRoleEnum,
    enum: ChatCompletionRequestMessageRoleEnum,
    // examples: ChatCompletionRequestMessageRoleEnum,
    description: 'The role of the author of this message.',
  })
  role: ChatCompletionRequestMessageRoleEnum;
  content: string | undefined;
  name?: string | undefined;
}

export class CreateChatCompletionResponseChoicesInnerDto
  implements CreateChatCompletionResponseChoicesInner
{
  index?: number | undefined;

  @ApiProperty({
    type: ChatCompletionRequestMessageDto,
  })
  message?: ChatCompletionRequestMessage | undefined;

  @ApiProperty({
    description: `
      stop: API返回完整的模型输出 
      length:由于max_tokens参数或token限制，模型输出不完整 
      content_filter:由于我们的内容过滤器的标志而省略的内容 
      null: API响应仍在进行中或未完成
    `,
  })
  finish_reason?: string | undefined;
}

export class CreateChatCompletionChoicesDto
  implements CreateChatCompletionChoicesResponse
{
  @ApiProperty({
    type: [CreateChatCompletionResponseChoicesInnerDto],
  })
  choices: CreateChatCompletionResponseChoicesInner[];
}
