/*
 * @Author: hsycc
 * @Date: 2023-05-07 03:44:52
 * @LastEditTime: 2023-05-09 05:26:33
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PRISMA_CLIENT_SERVICE_NAME } from '../constants';
import { CustomPrismaService } from 'nestjs-prisma';
import { PrismaClient } from '.prisma/user-client';

import { UserModelList, UserModel } from '@proto/gen/user.pb';
import {
  QueryUserByIdRequestDto,
  QueryUserByNameRequestDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from './dto/user.dto';
import { GrpcInternalException } from '@app/grpc';

@Injectable()
export class UserService {
  constructor(
    @Inject(PRISMA_CLIENT_SERVICE_NAME)
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}

  async createUser(dto: CreateUserRequestDto): Promise<UserModel> {
    const { username, password } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashedPassword', hashedPassword);
    const user = await this.prisma.client.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    return user as unknown as UserModel;
  }

  async deleteUser(dto: QueryUserByIdRequestDto): Promise<void> {
    const { id } = dto;
    const user = await this.prisma.client.user.delete({ where: { id } });
    if (!user) {
      throw new GrpcInternalException('User not found');
    }
  }

  async updateUser(dto: UpdateUserRequestDto): Promise<void> {
    const { id, avatar, password, status, role, accessKey, secretKey } = dto;
    const updateData = {} as any;
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

  async getUserByName(
    dto: QueryUserByNameRequestDto,
  ): Promise<UserModel | null> {
    const { username } = dto;
    const user = await this.prisma.client.user.findUnique({
      where: { username },
    });
    if (!user) {
      throw new GrpcInternalException('User not found');
    }
    return user as unknown as UserModel;
  }

  async getUserById(dto: QueryUserByIdRequestDto): Promise<UserModel> {
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
    return { list: users } as unknown as UserModelList;
  }
}
