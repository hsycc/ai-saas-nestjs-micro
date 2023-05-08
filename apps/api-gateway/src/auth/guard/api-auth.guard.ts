/*
 * @Author: hsycc
 * @Date: 2023-04-28 14:49:49
 * @LastEditTime: 2023-05-06 10:02:18
 * @Description: 
 * Usage
  import { ApiAuthGuard } from '@/common/guards/api-auth.guard';
  @UseGuards(ApiAuthGuard)
  @SetMetadata('needOwner', boolean)
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 获取chain的信息, 更可以进行权限拦截(如果这个链不属于该用户的话)
 */
@Injectable()
export class ApiAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const needOwner = this.reflector.get<string[]>(
      'needOwner',
      context.getHandler(),
    );

    if (needOwner) {
      /** 鉴权, 查看是否有该链的权限 */
      throw new UnauthorizedException();
    }

    // TODO: 取消默认值
    const id = request.headers['_cid'] || '1';

    // const chainInfo = await this.chainService.getInfo(id);

    // if (chainInfo) {
    //   const {
    //     chainId,
    //     encryptedPrivateKey,
    //     jsonrpc,
    //     mongodb,
    //     public_key,
    //   } = chainInfo;
    //   request._chainId = chainId;
    //   request._privateKeyHash = encryptedPrivateKey;
    //   request._publicKey = public_key;
    //   request._rpcURL = jsonrpc;
    //   request._mongoURL = mongodb;
    //   return true;
    // }

    return false;
  }
}
