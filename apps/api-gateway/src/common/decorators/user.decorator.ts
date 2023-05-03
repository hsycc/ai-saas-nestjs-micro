/*
 * 获取当前用户登录信息
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-26 18:39:47
 * @Description:
 *
 */
import {
  createParamDecorator,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';

export interface CurrentUserDecoratorData {
  /** 想要获取的属性 */
  property?: string;
  options?: {
    /** 是否强求要有登录信息, 未登录会抛出异常 */
    required?: boolean;
  };
}

/**
 * 可以指定装饰器参数
 * 如果没有指定, 默认获取 `user.id`
 * 如果有指定, 参考 `CurrentUserDecoratorData`
 */
export const CurrentUser = createParamDecorator(
  (data: CurrentUserDecoratorData | string = 'id', ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    let result;
    if (typeof data === 'string') {
      result = req.user[data];
    } else {
      result = data.property ? req.user[data.property] : req.user;
      if (data.options.required && !result) {
        throw new UnauthorizedException();
      }
    }
    return result;
  },
);
