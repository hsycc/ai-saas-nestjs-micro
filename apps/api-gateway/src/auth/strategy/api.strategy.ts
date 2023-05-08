/*
 * 本地化登录 认证策略
 * @Author: hsycc
 * @Date: 2023-05-08 06:10:42
 * @LastEditTime: 2023-05-08 10:07:00
 * @Description:
 *
 */
// import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-strategy';

@Injectable()
export class ApiStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(payload): Promise<any> {
    console.log('ApiStrategy validate');
  }
}
