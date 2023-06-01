/*
 * @Author: hsycc
 * @Date: 2023-05-11 03:15:26
 * @LastEditTime: 2023-06-02 06:46:45
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
  CreateChatCompletionChoicesResponse,
} from '@proto/gen/ai.pb';
import {
  CreateChatModelDto,
  QueryChatModelByIdDto,
  QueryChatModelListDto,
  UpdateChatModelDto,
} from './dto';
import { CreateChatCompletionDto } from './dto/create-chat-completion.dto';
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'createChatModel')
  private createChatModel(payload: CreateChatModelDto): Promise<ChatModel> {
    return this.chatService.createChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'deleteChatModel')
  private deleteChatModel(payload: QueryChatModelByIdDto): Promise<void> {
    return this.chatService.deleteChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'updateChatModel')
  private updateChatModel(payload: UpdateChatModelDto): Promise<void> {
    return this.chatService.updateChatModel(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelById')
  private getChatModelById(payload: QueryChatModelByIdDto): Promise<ChatModel> {
    return this.chatService.getChatModelById(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelList')
  private getChatModelList(
    payload: QueryChatModelListDto,
  ): Promise<ChatModelList> {
    return this.chatService.getChatModelList(payload);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'createChatCompletion')
  private createChatCompletion(
    payload: CreateChatCompletionDto,
  ): Promise<CreateChatCompletionChoicesResponse> {
    return this.chatService.createChatCompletion(payload);
  }
}
