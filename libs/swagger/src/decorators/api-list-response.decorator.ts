/*
 * 装饰器
 * http swagger Schemas泛型响应结构  ApiResponse list 泛型
 * @Author: hsycc
 * @Date: 2023-04-25 17:31:32
 * @LastEditTime: 2023-05-10 06:00:20
 * @Description:
 *
 */
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseListDto } from '../dto';

export const ApiListResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseListDto) },
          {
            properties: {
              code: { type: 'number', default: 0 },
              statusCode: { type: 'number', default: 200 },
              message: { type: 'string', default: 'success' },
              data: {
                properties: {
                  results: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
