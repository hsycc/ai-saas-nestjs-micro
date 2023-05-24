/*
 * 获取当 ak/sk 鉴权的所属渠道用户信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-05-24 22:34:17
 * @Description:
 *
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CONSTANT_AK_OF_USER } from '../strategy/ak-sk.strategy';
import Utils from '@lib/common/utils/helper';

export interface CurrentUserDecoratorData {
  property?: string;
}

export const CurrentAkSkOfUser = createParamDecorator(
  (data: CurrentUserDecoratorData | string = 'id', ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!req[CONSTANT_AK_OF_USER] && Utils.isDev) {
      return '';
    }
    let result;
    if (typeof data === 'string') {
      result = req[CONSTANT_AK_OF_USER][data];
    } else {
      result = data.property
        ? req[CONSTANT_AK_OF_USER][data.property]
        : req[CONSTANT_AK_OF_USER];
    }
    return result;
  },
);
