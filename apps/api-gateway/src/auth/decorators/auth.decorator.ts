/*
 * @Author: hsycc
 * @Date: 2023-05-06 09:54:31
 * @LastEditTime: 2023-05-11 10:46:24
 * @Description:
 *
 */
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AkSkAuthGuard, JwtAuthGuard, LocalAuthGuard } from '../guard';
import { ApiObjResponse } from '@lib/swagger';
import { AccessTokenDto, LoginAuthDto } from '../dto';

export type AuthName = 'local' | 'jwt' | 'ak/sk';
export interface AuthOptions {
  skipApiAuth?: boolean;
}
export const DefaultAuthOptions: AuthOptions = {
  skipApiAuth: false,
};
//
export function Auth(
  name: AuthName = 'jwt',
  options: AuthOptions = DefaultAuthOptions,
) {
  switch (name) {
    case 'ak/sk':
      return applyDecorators(
        UseGuards(AkSkAuthGuard),
        SetMetadata('skipAuth', options?.skipApiAuth),
        ApiHeader({ name: 'ak' }),
        ApiHeader({
          name: 'signature',
          description: `ak/sk 签名`,
        }),
      );
    case 'jwt':
      return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard));

    case 'local':
      return applyDecorators(
        UseGuards(LocalAuthGuard),
        ApiBody({ type: LoginAuthDto }),
        ApiObjResponse(AccessTokenDto),
      );
    default:
      break;
  }
}
