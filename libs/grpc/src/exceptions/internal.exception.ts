/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-11 03:48:21
 * @Description:
 *
 */
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcInternalException extends RpcException {
  constructor(error: string | object = 'Internal server error') {
    super(errorObject(error, status.INTERNAL));
  }
}
