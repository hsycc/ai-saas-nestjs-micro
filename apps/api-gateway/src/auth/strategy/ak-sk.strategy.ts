/*
 * ak/sk 认证策略
 * 第三方无用户状态调用 ai 服务 api 的鉴权
 * @Author: hsycc
 * @Date: 2023-05-08 06:10:42
 * @LastEditTime: 2023-05-11 08:11:07
 * @Description:
 *
 */
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
@Injectable()
export class AkSkStrategy extends PassportStrategy(Strategy, 'ak/sk') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    console.log('AkSkStrategy validate');
    // 从元数据取 skipApiAuth 判断
    const header = req.headers;
    // const authToken = headers['authorization'];

    // 在这里验证 ak/sk 签名，返回自定义的渠道用户相关信息 挂载到 req
    // const user = await this.authService.validateUserByToken(authToken);
    // if (!user) {
    //   throw new ForbiddenException('Invalid 签名');
    // }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // req.a = 2222;

    return { a: '22' };
  }
}
