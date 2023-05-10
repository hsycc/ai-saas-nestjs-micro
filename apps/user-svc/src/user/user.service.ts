/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-05-10 08:09:21
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
import { PrismaClient, Prisma } from '.prisma/user-client';

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
    const user = await this.prisma.client.user.create({
      data,
    });
    return user as unknown as UserModel;
  }

  async deleteUser(dto: QueryUserByIdDto): Promise<void> {
    const { id } = dto;
    const user = await this.prisma.client.user.delete({ where: { id } });
    if (!user) {
      throw new GrpcInternalException('User not found');
    }
  }

  async updateUser(dto: UpdateUserDto): Promise<void> {
    const { id, avatar, password, status, role, accessKey, secretKey } = dto;
    const updateData: Prisma.UserUpdateInput = {};
    if (avatar) {
      updateData.avatar = avatar;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (status) {
      updateData.status = status;
    }
    if (role) {
      updateData.role = role;
    }
    if (accessKey) {
      updateData.accessKey = accessKey;
    }
    if (secretKey) {
      updateData.secretKey = secretKey;
    }
    const user = await this.prisma.client.user.update({
      where: { id },
      data: updateData,
    });
    if (!user) {
      throw new GrpcInternalException('User not found');
    }
  }

  async getUserByName(dto: QueryUserByNameDto): Promise<UserModel | null> {
    const { username } = dto;
    const user = await this.prisma.client.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new GrpcInternalException('User not found');
    }
    return user as unknown as UserModel;
  }

  async getUserById(dto: QueryUserByIdDto): Promise<UserModel> {
    const { id } = dto;
    const user = await this.prisma.client.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new GrpcInternalException('User not found');
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
