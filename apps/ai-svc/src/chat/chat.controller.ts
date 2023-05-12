/*
 * @Author: hsycc
 * @Date: 2023-05-11 03:15:26
 * @LastEditTime: 2023-05-11 14:54:59
 * @Description:
 *
 */
import { Controller } from '@nestjs/common';
import { ChatService } from './chat.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  AI_CHAT_MODEL_SERVICE_NAME,
  ChatModel,
  ChatModelList,
} from '@proto/gen/ai.pb';
import {
  CreateChatModelDto,
  QueryChatModelByIdDto,
  QueryChatModelListDto,
  UpdateChatModelDto,
} from './dto';

@Controller()
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'createChatModel')
  private createChatModel(payload: CreateChatModelDto): Promise<ChatModel> {
    return this.service.createChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'deleteChatModel')
  private deleteChatModel(payload: QueryChatModelByIdDto): Promise<void> {
    return this.service.deleteChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'updateChatModel')
  private updateChatModel(payload: UpdateChatModelDto): Promise<void> {
    return this.service.updateChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelById')
  private getChatModelById(payload: QueryChatModelByIdDto): Promise<ChatModel> {
    return this.service.getChatModelById(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelList')
  private getChatModelList(
    payload: QueryChatModelListDto,
  ): Promise<ChatModelList> {
    return this.service.getChatModelList(payload);
  }
}
