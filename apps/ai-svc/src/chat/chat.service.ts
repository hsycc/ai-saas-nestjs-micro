/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-05-11 18:30:33
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';

import { ChatModel, ChatModelList } from '@proto/gen/ai.pb';
import {
  GrpcInternalException,
  GrpcPermissionDeniedException,
} from '@lib/grpc';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { PrismaClient, Prisma } from '@prisma/@ai-client';
import {
  CreateChatModelDto,
  QueryChatModelByIdDto,
  QueryChatModelListDto,
  UpdateChatModelDto,
} from './dto';

@Injectable()
export class ChatService {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_AI)
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async createChatModel(dto: CreateChatModelDto): Promise<ChatModel> {
    // TODO: 过滤相同name的重复创建
    try {
      return this.prisma.client.chatModel.create({
        data: {
          ...dto,
        } as unknown as Prisma.ChatModelCreateInput,
      }) as unknown as ChatModel;
      // return _data as unknown as ChatModel;
    } catch (error) {
      throw new GrpcInternalException();
    }
  }

  async deleteChatModel(dto: QueryChatModelByIdDto): Promise<void> {
    const { id, userId } = dto;
    try {
      await this.prisma.client.chatModel.findFirstOrThrow({
        where: { id, userId },
      });
      await this.prisma.client.chatModel.delete({ where: { id } });
    } catch (error) {
      throw new GrpcPermissionDeniedException();
    }
  }

  async updateChatModel(dto: UpdateChatModelDto): Promise<void> {
    try {
      const { id, userId } = dto;

      await this.prisma.client.chatModel.findFirstOrThrow({
        where: { id, userId },
      });

      const data = {
        ...dto,
      } as unknown as Prisma.ChatModelUpdateInput;
      await this.prisma.client.chatModel.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      throw new GrpcPermissionDeniedException();
    }
  }

  async getChatModelById(dto: QueryChatModelByIdDto): Promise<ChatModel> {
    const { id, userId } = dto;

    try {
      const data = await this.prisma.client.chatModel.findFirstOrThrow({
        where: { id, userId },
      });
      return data as unknown as ChatModel;
    } catch (error) {
      throw new GrpcPermissionDeniedException();
    }
  }

  async getChatModelList(dto: QueryChatModelListDto): Promise<ChatModelList> {
    const { userId, current, pageSize } = dto;
    // const ChatModels =
    const [results, total] = await Promise.all([
      this.prisma.client.chatModel.findMany({
        where: {
          userId,
        },
        take: pageSize,
        skip: (current - 1) * pageSize,
      }),
      this.prisma.client.chatModel.count({
        where: {
          userId,
        },
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
}
