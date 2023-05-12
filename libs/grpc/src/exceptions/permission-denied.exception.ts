/*
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-11 15:02:56
 * @Description:
 *
 */
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { errorObject } from '../utils';

export class GrpcPermissionDeniedException extends RpcException {
  constructor(error: string | object = 'Forbidden') {
    super(errorObject(error, status.PERMISSION_DENIED));
  }
}
