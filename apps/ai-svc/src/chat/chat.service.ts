/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-06-02 07:16:51
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma/dist/custom';

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
import { FormatClsMetadata } from '@app/api-gateway/auth/decorators/cls-metadata.decorator';

@Injectable()
export class ChatService {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_AI)
    private prisma: CustomPrismaService<PrismaClient>,
    private readonly openAiService: OpenAiService,
  ) {}

  async createChatModel(dto: CreateChatModelDto): Promise<ChatModel> {
    const userId = FormatClsMetadata().userId;

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

  async deleteChatModel(dto: QueryChatModelByIdDto): Promise<void> {
    const { id } = dto;
    const userId = FormatClsMetadata().userId;
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

  async updateChatModel(dto: UpdateChatModelDto): Promise<void> {
    try {
      const { id } = dto;
      const userId = FormatClsMetadata().userId;

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

  async getChatModelById(dto: QueryChatModelByIdDto): Promise<ChatModel> {
    const { id } = dto;
    const userId = FormatClsMetadata().userId;

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

  async getChatModelList(dto: QueryChatModelListDto): Promise<ChatModelList> {
    const { current, pageSize } = dto;
    const userId = FormatClsMetadata().userId;
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
  ): Promise<CreateChatCompletionChoicesResponse> {
    const { chaModelId, messages = [], question } = dto;
    let struct: ChatModelStructItem[] = [];
    if (chaModelId) {
      const chatModel = await this.getChatModelById({
        id: chaModelId,
      });

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
