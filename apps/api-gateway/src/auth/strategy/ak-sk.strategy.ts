/*
 * ak/sk 认证策略
 * 第三方无用户状态调用 ai 服务 api 的鉴权
 * @Author: hsycc
 * @Date: 2023-05-08 06:10:42
 * @LastEditTime: 2023-05-15 15:42:18
 * @Description:
 *
 */
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  BadRequestException,
  // InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { CloudAuth, SignAndVerifyType, getAesInstance } from '@lib/common';
@Injectable()
export class AkSkStrategy extends PassportStrategy(Strategy, 'ak/sk') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const { method, url, query, headers } = req;
    console.log('aksSkStrategy validate');
    // 从元数据取 skipApiAuth 判断

    const xAuthorization = headers['x-authorization'] as string;

    // 判断是否带有请求头
    if (!xAuthorization) {
      throw new ForbiddenException('InvalidHTTPAuthHeader');
    }

    const [version, accessKey, date, signedHeaders, signature] =
      xAuthorization.split('/');

    // 判断版本前缀是否合法
    if (version.match(/^cc-auth-v\d+$/)) {
      throw new NotFoundException('InvalidVersion');
    }

    // 判断 ak格式 是否合法
    if (!accessKey || !/^\w{20}$/.test(accessKey)) {
      throw new ForbiddenException('InvalidAccessKeyId');
    }

    // 查询 db 是否存在 该 accessKey
    const user = await this.authService.validateAccessKey(accessKey);

    if (!user) {
      throw new ForbiddenException('AccessDenied');
    }

    const secretKey = getAesInstance(2).encrypt(user.secretKey);

    const cloudAuth = new CloudAuth({
      accessKey: accessKey,
      secretKey: secretKey,
    });

    const parmas: SignAndVerifyType = {
      date,
      method,
      url,
      query,
      headers: signedHeaders.split(';').map((v) => headers[v]),
    };

    // 验证 头域中附带的签名与服务端签名是否一致
    if (cloudAuth.verify(parmas, signature)) {
      throw new BadRequestException('SignatureDoesNotMatch');
    }

    // checkout 签名是否过期
    // if (false) {
    //   throw new BadRequestException('RequestExpired');
    // }

    //  自定义的渠道用户相关信息 挂载到 req
    req.user = user;

    return true;
  }
}
