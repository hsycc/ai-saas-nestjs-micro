/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-24 23:00:28
 * @Description:
 *
 */
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcAlreadyExistsException extends RpcException {
  constructor(error: string | object = 'Already exists') {
    super(errorObject(error, status.ALREADY_EXISTS));
  }
}
