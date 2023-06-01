/*
 * rpcException 封装
 * @Author: hsycc
 * @Date: 2023-04-24 15:19:42
 * @LastEditTime: 2023-05-31 10:56:33
 * @Description:
 *
 */

import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcResourceExhaustedException extends RpcException {
  constructor(error: string | object) {
    super(errorObject(error, status.RESOURCE_EXHAUSTED));
  }
}
