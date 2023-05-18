/*
 * ak/sk 认证策略
 * 第三方无用户状态调用 ai 服务 api 的鉴权
 * @Author: hsycc
 * @Date: 2023-05-08 06:10:42
 * @LastEditTime: 2023-05-18 21:56:20
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
import {
  CONSTANT_AUTH_VERSION_V1,
  CONSTANT_X_AUTHORIZATION,
  CloudAkSkAuth,
  SignAndVerifyType,
  getAesInstance,
} from '@lib/common';
import { isNumber } from 'class-validator';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Utils from '@lib/common/utils/helper';
dayjs.extend(utc);

export const CONSTANT_AK_OF_USER = 'ak_of_user';

@Injectable()
export class AkSkStrategy extends PassportStrategy(Strategy, 'ak/sk') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<any> {
    const { method, url, query, headers } = req;

    // 兼容 header and query
    const xAuthorization = (headers[CONSTANT_X_AUTHORIZATION] ||
      query[CONSTANT_X_AUTHORIZATION]) as string;

    // 判断是否带有请求头
    if (!xAuthorization) {
      throw new ForbiddenException('InvalidHTTPAuthHeader');
    }

    const [
      version,
      accessKey,
      timestamp,
      expirationPeriodInSeconds,
      signedHeaders,
      signature,
    ] = xAuthorization.split('/');

    // 判断版本前缀是否合法
    if (version !== CONSTANT_AUTH_VERSION_V1) {
      throw new NotFoundException('InvalidVersion');
    }

    // 判断 ak格式 是否合法
    if (!accessKey || !/^\w{20}$/.test(accessKey)) {
      throw new ForbiddenException('InvalidAccessKeyId');
    }

    // 判断 timestamp 是否 为 utc 时间， 格式为 yyyy-mm-ddThh:mm:ssZ
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/.test(timestamp)) {
      throw new BadRequestException('InvalidTimestamp');
    }

    const now = dayjs();
    const signTimestamp = dayjs(timestamp);

    const diffInSeconds = Math.abs(now.diff(signTimestamp, 'seconds'));

    // 判断 expirationPeriodInSeconds 是否合法
    if (
      !isNumber(Number(expirationPeriodInSeconds)) ||
      Number(expirationPeriodInSeconds) <= 0
    ) {
      throw new BadRequestException('RequestExpired');
    }

    // 开发环境不判断 时间有效性
    if (!Utils.isDev) {
      if (
        diffInSeconds >= Number(expirationPeriodInSeconds) ||
        now.isBefore(signTimestamp)
      ) {
        throw new BadRequestException('RequestExpired');
      }
    }

    // 查询 db 是否存在 该 accessKey
    const user = await this.authService.validateAccessKey(accessKey);

    if (!user) {
      throw new ForbiddenException('AccessDenied');
    }

    const secretKey = getAesInstance(2).decrypt(user.secretKey);

    const cloudAkSkAuth = new CloudAkSkAuth({
      accessKey: accessKey,
      secretKey: secretKey,
    });

    const signHeaders = {};

    signedHeaders.split(';').map((v) => {
      signHeaders[v] = headers[v];
    });

    const parmas: SignAndVerifyType = {
      timestamp,
      expirationPeriodInSeconds: Number(expirationPeriodInSeconds),
      method,
      url,
      query,
      headers: signHeaders,
    };

    // 验证 头域中附带的签名与服务端签名是否一致
    if (!cloudAkSkAuth.verify(parmas, signature)) {
      throw new BadRequestException('SignatureDoesNotMatch');
    }

    //  自定义的渠道用户相关信息 挂载到 req
    req[CONSTANT_AK_OF_USER] = user;

    req.user = user;

    return true;
  }
}
