/*
 * @Author: hsycc
 * @Date: 2023-05-10 05:02:58
 * @LastEditTime: 2023-05-10 05:48:50
 * @Description:
 *
 */

import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  ResponseDto,
  ResponseListDataDto,
  ResponseListDto,
  ResponseObjDto,
  ResponsePaginatedDataDto,
} from '../dto';

export function BaseApiExtraModels(...args) {
  return applyDecorators(
    ApiExtraModels(
      ResponseDto,
      ResponseObjDto,
      ResponseListDto,
      ResponseListDataDto,
      ResponsePaginatedDataDto,
      ...args,
    ),
  );
}
