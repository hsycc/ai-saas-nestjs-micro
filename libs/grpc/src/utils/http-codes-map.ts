/*
 * @Author: hsycc
 * @Date: 2023-05-09 15:09:29
 * @LastEditTime: 2023-05-31 11:07:36
 * @Description:
 *
 */
import { status as Status } from '@grpc/grpc-js';
import { HttpStatus } from '@nestjs/common';

// https://github.com/mohsenbostan/nestjs-grpc-exceptions
// list of supported http status codes: 401 - 403 - 502 - 404 - 405 - 409 - 422 - 429 - 500 - 503
// https:skyao.gitbooks.io/learning-grpc/content/server/status/class_Status.html
export const HTTP_CODE_FROM_GRPC: Record<number, number> = {
  [Status.OK]: HttpStatus.OK,
  [Status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
  [Status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [Status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
  [Status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [Status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [Status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [Status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [Status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [Status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
  [Status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
  [Status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
  [Status.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
  [Status.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
  [Status.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
  [Status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [Status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};
