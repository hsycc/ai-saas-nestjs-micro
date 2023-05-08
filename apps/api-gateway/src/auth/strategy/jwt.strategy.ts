/*
 * jwt 认证策略
 * @Author: hsycc
 * @Date: 2023-05-08 09:21:50
 * @LastEditTime: 2023-05-08 09:33:58
 * @Description:
 *
 */

import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interface';
import { JwtConfigType } from '@lib/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // 提供从请求中提取 JWT 的方法
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 过期token将被拒绝
      ignoreExpiration: false,
      secretOrKey: config.get<JwtConfigType>('JwtConfig').accessSecretKey,
    });
  }

  /**
   * token -> JSON
   * 根据 JWT 签名的工作方式，我们可以保证接收到之前已签名并发给有效用户的有效 token 令牌。
   * @param payload JwtPayload
   */
  async validate(
    payload: JwtPayload,
  ): Promise<{ id: string; username: string }> {
    console.log('jwt ======== validate');

    // 我们可以在此方法中执行数据库查询, 以提取关于用户的更多信息. 从而在请求中提供更丰富的用户对象
    // 例如在已撤销的令牌列表中查找 userId ，使我们能够执行令牌撤销。
    // 双token策略 accessToken refreshToken 刷新
    return { id: payload.sub, username: payload.username };
  }
}
