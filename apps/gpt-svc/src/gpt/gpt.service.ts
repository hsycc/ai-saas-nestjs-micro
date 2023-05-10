/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:18:23
 * @LastEditTime: 2023-05-10 02:40:28
 * @Description:
 *
 */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/gpt-client';
import { loggingMiddleware } from '../common/prisma/logging.middleware';
import { PRISMA_CLIENT_NAME_GPT } from '@prisma/scripts/constants';
@Injectable()
export class GptService implements OnModuleInit {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_GPT) // 👈 use unique name to reference
    private prisma: CustomPrismaService<PrismaClient>, // specify PrismaClient for type-safety & auto-completion
  ) {}

  public onModuleInit(): void {
    this.prisma.client.$use(loggingMiddleware());
  }

  public async stt() {
    this.prisma.client.chatModel.create({
      data: {
        name: '菜提猫',
      },
    });
    //
  }
}
