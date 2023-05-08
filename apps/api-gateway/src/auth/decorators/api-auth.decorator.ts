/*
 * @Author: hsycc
 * @Date: 2023-05-06 09:54:31
 * @LastEditTime: 2023-05-08 05:28:05
 * @Description:
 *
 */
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiAuthGuard } from '../guard/api-auth.guard';
import { ApiHeader } from '@nestjs/swagger';

export function ApiAuth() {
  return applyDecorators(
    UseGuards(ApiAuthGuard),
    SetMetadata('skipAuth', false),
    ApiHeader({ name: 'cuid' }),
    ApiHeader({
      name: 'proof',
      description: `rsa encrypt(cid=${'cid'}&timestamp=${'Date.now()'}&signature=${'signature'})`,
    }),
  );
}
