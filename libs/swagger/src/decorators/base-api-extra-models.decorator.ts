/*
 * @Author: hsycc
 * @Date: 2023-05-10 05:02:58
 * @LastEditTime: 2023-05-13 00:17:46
 * @Description:
 *
 */

import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import {
  ResPaginatedDto,
  ResponseDto,
  ResponseListDataDto,
  ResponseListDto,
  ResponseObjDto,
  ResponsePaginatedDataDto,
  ResponsePaginatedDto,
} from '../dto';

export function BaseApiExtraModels(...args) {
  return applyDecorators(
    ApiExtraModels(
      ResponseDto,
      ResponseObjDto,
      ResponseListDto,
      ResponseListDataDto,
      ResPaginatedDto,
      ResponsePaginatedDto,
      ResponsePaginatedDataDto,
      ...args,
    ),
  );
}
