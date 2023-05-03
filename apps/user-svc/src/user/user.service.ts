import { GrpcNotFoundException } from '../../../../libs/grpc-to-http-exceptions/src/exceptions/not-found.exception';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';
import {
  RegisterRequestDto,
  LoginRequestDto,
  ValidateRequestDto,
} from './user.dto';
import { User } from './user.entity';
import {
  LoginResponse,
  RegisterResponse,
  ValidateResponse,
} from '@proto/gen/user.pb';
import { GrpcUnauthenticatedException } from '@app/grpc-to-http-exceptions';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,

    // @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}
  public async register({
    email,
    password,
  }: RegisterRequestDto): Promise<RegisterResponse> {
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      return { status: HttpStatus.CONFLICT, error: ['E-Mail already exists'] };
    }

    user = new User();

    user.email = email;
    user.password = this.jwtService.encodePassword(password);

    await this.repository.save(user);

    return { status: HttpStatus.CREATED, error: null };
  }

  public async login({
    email,
    password,
  }: LoginRequestDto): Promise<LoginResponse> {
    const user: User = await this.repository.findOne({ where: { email } });

    if (!user) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['E-Mail not found'],
        token: null,
      };
    }

    const isPasswordValid: boolean = this.jwtService.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Password wrong'],
        token: null,
      };
    }

    const token: string = this.jwtService.generateToken(user);

    return { token, status: HttpStatus.OK, error: null };
  }

  public async validate({
    token,
  }: ValidateRequestDto): Promise<ValidateResponse> {
    const decoded: User = await this.jwtService.verify(token);
    // TODO:
    // 我们可以在此方法中执行数据库查询, 以提取关于用户的更多信息. 从而在请求中提供更丰富的用户对象
    // 例如在已撤销的令牌列表中查找 userId ，使我们能够执行令牌撤销。

    if (!decoded) {
      throw new GrpcUnauthenticatedException('Unauthorized');
    }

    const user: User = await this.jwtService.validateUser(decoded);

    if (!user) {
      throw new GrpcNotFoundException('User not found');
    }

    return { userId: decoded.id } as any;
  }
}
