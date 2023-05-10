/*
 * 装饰器
 * http swagger Schemas泛型响应结构 ApiResponse  泛型
 * @Author: hsycc
 * @Date: 2023-04-25 17:31:32
 * @LastEditTime: 2023-05-10 08:19:43
 * @Description:
 *
 */
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiBaseResponse = (status: HttpStatus = HttpStatus.OK) => {
  return applyDecorators(
    ApiResponse({
      status: status,
      schema: {
        allOf: [
          {
            properties: {
              code: { type: 'number', default: 0 },
              statusCode: { type: 'number', default: 200 },
              message: { type: 'string', default: 'success' },
              data: {
                properties: {},
              },
            },
          },
        ],
      },
    }),
  );
};
