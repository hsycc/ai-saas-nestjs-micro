/*
 * @Author: hsycc
 * @Date: 2023-05-11 03:15:26
 * @LastEditTime: 2023-05-24 18:21:58
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
import { Metadata } from '@grpc/grpc-js';
import { CreateChatCompletionDto } from './dto/create-chat-completion.dto';
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'createChatModel')
  private createChatModel(
    payload: CreateChatModelDto,
    metadata: Metadata,
  ): Promise<ChatModel> {
    return this.chatService.createChatModel(payload, metadata);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'deleteChatModel')
  private deleteChatModel(
    payload: QueryChatModelByIdDto,
    metadata: Metadata,
  ): Promise<void> {
    return this.chatService.deleteChatModel(payload, metadata);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'updateChatModel')
  private updateChatModel(
    payload: UpdateChatModelDto,
    metadata: Metadata,
  ): Promise<void> {
    return this.chatService.updateChatModel(payload, metadata);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelById')
  private getChatModelById(
    payload: QueryChatModelByIdDto,
    metadata: Metadata,
  ): Promise<ChatModel> {
    return this.chatService.getChatModelById(payload, metadata);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'getChatModelList')
  private getChatModelList(
    payload: QueryChatModelListDto,
    metadata: Metadata,
  ): Promise<ChatModelList> {
    return this.chatService.getChatModelList(payload, metadata);
  }

  @GrpcMethod(AI_CHAT_MODEL_SERVICE_NAME, 'createChatCompletion')
  private createChatCompletion(
    payload: CreateChatCompletionDto,
    metadata: Metadata,
  ): Promise<CreateChatCompletionChoicesResponse> {
    return this.chatService.createChatCompletion(payload, metadata);
  }
}
