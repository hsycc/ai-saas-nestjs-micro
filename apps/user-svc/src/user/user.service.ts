/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-06 00:57:21
 * @Description:
 *
 */
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from './jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '@proto/gen/user.pb';
import {
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
} from '@app/grpc-to-http-exceptions';
import { CustomPrismaService } from 'nestjs-prisma';
import { PRISMA_CLIENT_SERVICE_NAME } from '../constants';
import { PrismaClient } from '.prisma/user-client';
@Injectable()
export class UserService {
  constructor(
    // @Inject(JwtService)
    private readonly jwtService: JwtService,

    @Inject(PRISMA_CLIENT_SERVICE_NAME)
    private prisma: CustomPrismaService<PrismaClient>,
  ) {}
  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse | any> {
    // eslint-disable-next-line prefer-const
    let user: UserEntity;
    //  = await this.repository.findOne({ where: { email } });

    if (user) {
      // return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    user = new UserEntity();

    // user.email = email;
    user.password = this.jwtService.encodePassword(password);

    // await this.repository.save(user);

    // return { status: HttpStatus.CREATED, error: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse | any> {
    let user: UserEntity;
    // = await this.repository.findOne({ where: { email } });

    if (!user) {
      // return {
      //   status: HttpStatus.NOT_FOUND,
      //   error: ['E-Mail not found'],
      //   token: null,
      // };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      // return {
      //   status: HttpStatus.NOT_FOUND,
      //   error: ['Password wrong'],
      //   token: null,
      // };
    }

    const token: string = this.jwtService.generateToken(user);

    // return { token, status: HttpStatus.OK, error: null };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse | any> {
    const decoded: UserEntity = await this.jwtService.verify(token);
    // TODO:
    // 我们可以在此方法中执行数据库查询, 以提取关于用户的更多信息. 从而在请求中提供更丰富的用户对象
    // 例如在已撤销的令牌列表中查找 userId ，使我们能够执行令牌撤销。

    if (!decoded) {
      throw new GrpcUnauthenticatedException('Unauthorized');
    }

    const user: UserEntity = await this.jwtService.validateUser(decoded);

    if (!user) {
      throw new GrpcNotFoundException('UserEntity not found');
    }

    // return { userId: decoded.id } as any;
  }
}
