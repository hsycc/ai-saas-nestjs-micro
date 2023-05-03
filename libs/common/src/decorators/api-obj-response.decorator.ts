/*
 * 装饰器
 * http swagger Schemas泛型响应结构 ApiResponse object 泛型
 * @Author: hsycc
 * @Date: 2023-04-25 17:31:32
 * @LastEditTime: 2023-04-25 18:20:19
 * @Description:
 *
 */
import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseObjDto } from '../../../grpc-to-http-exceptions/src/dto/response.dto';

export const ApiObjResponse = <TModel extends Type<any>>(
  model: TModel,
  status: HttpStatus = HttpStatus.OK,
) => {
  return applyDecorators(
    ApiResponse({
      status: status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseObjDto) },
          {
            properties: {
              code: { type: 'number', default: 0 },
              statusCode: { type: 'number', default: 200 },
              message: { type: 'string', default: 'success' },
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};
