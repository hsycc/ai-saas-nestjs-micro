import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Auth } from '../auth.entity';
import { JwtService } from '../service/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  constructor(config: ConfigService) {
    super({
      // 提供从请求中提取 JWT 的方法
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 过期token将被拒绝
      ignoreExpiration: true,
      secretOrKey: config.get<string>('JwtConfig.secretKey'),
    });
  }

  private validate(token: string): Promise<Auth | never> {
    return this.jwtService.validateUser(token);
  }
}
