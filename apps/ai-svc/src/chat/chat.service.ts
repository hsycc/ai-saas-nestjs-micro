/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-05-24 23:00:31
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import {
  ChatModel,
  ChatModelList,
  ChatModelStructItem,
  CreateChatCompletionChoicesResponse,
} from '@proto/gen/ai.pb';
import {
  GrpcAlreadyExistsException,
  GrpcInternalException,
  GrpcNotFoundException,
} from '@lib/grpc';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { PrismaClient, Prisma } from '@prisma/@ai-client';
import {
  CreateChatModelDto,
  QueryChatModelByIdDto,
  QueryChatModelListDto,
  UpdateChatModelDto,
} from './dto';
import { OpenAiService } from '@lib/open-ai';
import {
  CreateChatCompletionRequest,
  ChatCompletionRequestMessageRoleEnum,
  CreateChatCompletionResponse,
  ChatCompletionRequestMessage,
} from 'openai';
import { CreateChatCompletionDto } from './dto/create-chat-completion.dto';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class ChatService {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_AI)
    private prisma: CustomPrismaService<PrismaClient>,
    private readonly openAiService: OpenAiService,
  ) {}

  async createChatModel(
    dto: CreateChatModelDto,
    metadata: Metadata,
  ): Promise<ChatModel> {
    const userId = metadata.get('userId')[0] as string;

    try {
      const _data = await this.prisma.client.chatModel.create({
        data: {
          ...dto,
          userId,
        } as unknown as Prisma.ChatModelCreateInput,
      });

      return _data as unknown as ChatModel;
    } catch (error) {
      throw new GrpcAlreadyExistsException();
    }
  }

  async deleteChatModel(
    dto: QueryChatModelByIdDto,
    metadata: Metadata,
  ): Promise<void> {
    const { id } = dto;
    const userId = metadata.get('userId')[0] as string;
    try {
      await this.prisma.client.chatModel.findUniqueOrThrow({
        where: {
          idx_useId: {
            id,
            userId,
          },
        },
      });
      await this.prisma.client.chatModel.delete({ where: { id } });
    } catch (error) {
      throw new GrpcInternalException(error?.message);
    }
  }

  async updateChatModel(
    dto: UpdateChatModelDto,
    metadata: Metadata,
  ): Promise<void> {
    try {
      const { id } = dto;
      const userId = metadata.get('userId')[0] as string;

      await this.prisma.client.chatModel.findUniqueOrThrow({
        where: {
          idx_useId: {
            id,
            userId,
          },
        },
      });

      const data = {
        ...dto,
      } as unknown as Prisma.ChatModelUpdateInput;
      await this.prisma.client.chatModel.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      throw new GrpcInternalException(error?.message);
    }
  }

  async getChatModelById(
    dto: QueryChatModelByIdDto,
    metadata: Metadata,
  ): Promise<ChatModel> {
    const { id } = dto;
    const userId = metadata.get('userId')[0] as string;

    let where: Prisma.ChatModelWhereUniqueInput = { id };

    if (userId) {
      where = {
        idx_useId: {
          userId,
          id,
        },
      };
    }
    try {
      const data = await this.prisma.client.chatModel.findUniqueOrThrow({
        where,
      });
      return data as unknown as ChatModel;
    } catch (error) {
      throw new GrpcInternalException(error?.message);
    }
  }

  async getChatModelList(
    dto: QueryChatModelListDto,
    metadata: Metadata,
  ): Promise<ChatModelList> {
    const { current, pageSize } = dto;
    const userId = metadata.get('userId')[0] as string;
    let where: any = {};

    if (userId) {
      where = {
        userId,
      };
    }
    const [results, total] = await Promise.all([
      this.prisma.client.chatModel.findMany({
        where,
        take: pageSize,
        skip: (current - 1) * pageSize,
      }),
      this.prisma.client.chatModel.count({
        where,
      }),
    ]);

    return {
      pagination: {
        current,
        pageSize,
        total,
      },
      results,
    } as unknown as ChatModelList;
  }

  async createChatCompletion(
    dto: CreateChatCompletionDto,
    metadata: Metadata,
  ): Promise<CreateChatCompletionChoicesResponse> {
    const { chaModelId, messages = [], question } = dto;
    let struct: ChatModelStructItem[] = [];
    if (chaModelId) {
      const chatModel = await this.getChatModelById(
        {
          id: chaModelId,
        },
        metadata,
      );

      if (!chatModel) {
        throw new GrpcNotFoundException('ChatModel Not Found');
      }

      struct = chatModel.struct;
    }

    const params: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        ...(struct.map((v) => {
          return {
            role: v.key,
            content: v.value,
          };
        }) as ChatCompletionRequestMessage[]),
        ...messages,
        { role: ChatCompletionRequestMessageRoleEnum.User, content: question },
      ],
    };

    try {
      const completion: CreateChatCompletionResponse = (
        await this.openAiService.openai.createChatCompletion(params, {
          timeout: 30000,
        })
      ).data;

      const { usage, choices } = completion;

      // TODO: token usage 账单记录

      return {
        choices,
      };
    } catch (error) {
      // TODO: 捕获所有的 openai 的 response error
      throw new GrpcInternalException(error?.message);
    }
  }
}
