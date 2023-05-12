/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-11 15:07:46
 * @Description:
 *
 */
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcNotFoundException extends RpcException {
  constructor(error: string | object = 'Not Found') {
    super(errorObject(error, status.NOT_FOUND));
  }
}
