/*
 * 获取当 ak/sk 鉴权的所属渠道用户信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-06-02 06:10:05
 * @Description:
 *
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import Utils from '@lib/common/utils/helper';

export interface CurrentTenantDecoratorData {
  property?: string;
}

export const CurrentTenant = createParamDecorator(
  (data: CurrentTenantDecoratorData | string = 'id', ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.tenant && Utils.isDev) {
      return '';
    }
    let result;
    if (typeof data === 'string') {
      result = req.tenant[data];
    } else {
      result = data.property ? req.tenant[data.property] : req.tenant;
    }
    return result;
  },
);
