/*
 * 装饰器
 * http swagger Schemas泛型响应结构 ApiResponse Paginated分页
 * @Author: hsycc
 * @Date: 2023-04-25 17:31:32
 * @LastEditTime: 2023-04-28 13:37:07
 * @Description:
 *
 */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ResPaginatedDto,
  ResponsePaginatedDataDto,
  ResponsePaginatedDto,
} from '../dto';

// https://juejin.cn/post/7046597295361523725#heading-6

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponsePaginatedDto) },
          {
            properties: {
              code: { type: 'number', default: 0 },
              statusCode: { type: 'number', default: 200 },
              message: { type: 'string', default: 'success' },
              data: {
                allOf: [
                  { $ref: getSchemaPath(ResponsePaginatedDataDto) },
                  {
                    properties: {
                      results: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                      },
                      pagination: {
                        $ref: getSchemaPath(ResPaginatedDto),
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    }),
  );
};
