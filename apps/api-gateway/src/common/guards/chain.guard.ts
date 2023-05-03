/*
 * 使用方法:

    import { ChainGuard } from '@/common/guards/chain.guard';
    @UseGuards(ChainGuard)
    @SetMetadata('needOwner', boolean)

 * @Author: John Trump
 * @Date: 2020-09-25 16:11:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-28 14:50:18
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { ChainService } from '@/chain/chain.service';

/**
 * 获取chain的信息, 更可以进行权限拦截(如果这个链不属于该用户的话)
 */
@Injectable()
export class ChainGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // private readonly chainService: ChainService,
  ) {}

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
