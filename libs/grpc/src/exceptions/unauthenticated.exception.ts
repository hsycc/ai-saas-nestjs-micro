/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-11 15:16:51
 * @Description:
 *
 */
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcUnauthenticatedException extends RpcException {
  constructor(error: string | object = 'Unauthorized') {
    super(errorObject(error, status.UNAUTHENTICATED));
  }
}
