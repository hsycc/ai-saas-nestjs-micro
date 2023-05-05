/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:18:23
 * @LastEditTime: 2023-05-05 21:29:05
 * @Description:
 *
 */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CustomPrismaService, loggingMiddleware } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/gpt-client';
import { PRISMA_CLIENT_SERVICE_NAME } from '../constants';
@Injectable()
export class GptService implements OnModuleInit {
  constructor(
    @Inject(PRISMA_CLIENT_SERVICE_NAME) // 👈 use unique name to reference
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
