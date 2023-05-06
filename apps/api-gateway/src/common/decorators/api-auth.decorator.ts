/*
 * @Author: hsycc
 * @Date: 2023-05-06 09:54:31
 * @LastEditTime: 2023-05-06 10:00:54
 * @Description:
 *
 */
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiAuthGuard } from '../guards/api-auth.guard';
import { ApiHeader } from '@nestjs/swagger';

export function ApiAuth() {
  return applyDecorators(
    UseGuards(ApiAuthGuard),
    SetMetadata('skipAuth', false),
    ApiHeader({ name: 'cUid' }),
    ApiHeader({
      name: 'proof',
      description: `rsa encrypt(cid=${'cid'}&timestamp=${'Date.now()'}&signature=${'signature'})`,
    }),
  );
}
