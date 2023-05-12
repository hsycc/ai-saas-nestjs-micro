/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-05-11 14:34:54
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { CustomPrismaService } from 'nestjs-prisma';

import { UserModelList, UserModel } from '@proto/gen/user.pb';
import {
  QueryUserByIdDto,
  QueryUserByNameDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { GrpcInternalException } from '@lib/grpc';
import { genSaltSync, hashSync } from 'bcrypt';
import { AkSkUtil, getAesInstance } from '@lib/common';
import { PRISMA_CLIENT_NAME_USER } from '@prisma/scripts/constants';
import { PrismaClient, Prisma } from '@prisma/@user-client';

@Injectable()
export class UserService {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_USER)
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserModel> {
    const { username, password } = dto;

    const keys = AkSkUtil.generateKeys();
    keys.secretKey = getAesInstance(2).encrypt(keys.secretKey);

    const data: Prisma.UserCreateInput = {
      username,
      password: hashSync(password, genSaltSync(10)),
      ...keys,
    };
    try {
      const user = await this.prisma.client.user.create({
        data,
      });
      return user as unknown as UserModel;
    } catch (error) {
      throw new GrpcInternalException();
    }
  }

  async deleteUser(dto: QueryUserByIdDto): Promise<void> {
    const { id } = dto;
    // TODO: 拦截 prisma 的异常抛出
    try {
      await this.prisma.client.user.delete({ where: { id } });
    } catch (error) {
      throw new GrpcInternalException();
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<void> {
    const { id } = dto;
    const updateData: Prisma.UserUpdateInput = {
      ...dto,
    };

    await this.prisma.client.user.update({
      where: { id },
      data: updateData,
    });
    try {
      await this.prisma.client.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new GrpcInternalException();
    }
  }

  async getUserByName(dto: QueryUserByNameDto): Promise<UserModel | null> {
    const { username } = dto;
    const user = await this.prisma.client.user.findUnique({
      where: { username },
    });
    return (user as unknown as UserModel) || null;
  }

  async getUserById(dto: QueryUserByIdDto): Promise<UserModel> {
    const { id } = dto;
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new GrpcInternalException('Not found');
    }
    return user as unknown as UserModel;
  }

  async getUserModelList(): Promise<UserModelList> {
    const users = await this.prisma.client.user.findMany();
    return {
      results: users,
    } as unknown as UserModelList;
  }
}
