/*
 * @Author: hsycc
 * @Date: 2023-05-06 09:54:31
 * @LastEditTime: 2023-05-24 21:08:02
 * @Description:
 *
 */
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeaders, ApiQuery } from '@nestjs/swagger';
import { AkSkAuthGuard, JwtAuthGuard, LocalAuthGuard } from '../guard';
import { ApiObjResponse } from '@lib/swagger';
import { AccessTokenDto, LoginAuthDto } from '../dto';
import { CONSTANT_X_AUTHORIZATION } from '@lib/common';

export type AuthNameType = 'local' | 'jwt' | 'ak/sk';
export interface AuthOptions {
  skipApiAuth?: boolean;
}

export const CONSTANT_SKIP_AUTH = 'skipAuth';

export const DefaultAuthOptions: AuthOptions = {
  skipApiAuth: false,
};
//
export function Auth(
  name: AuthNameType = 'jwt',
  options: AuthOptions = DefaultAuthOptions,
) {
  switch (name) {
    case 'ak/sk':
      return applyDecorators(
        UseGuards(AkSkAuthGuard),
        SetMetadata(CONSTANT_SKIP_AUTH, options?.skipApiAuth),

        ApiHeaders([
          {
            name: CONSTANT_X_AUTHORIZATION,

            description: `ak/sk 认证字符串, 示例cc-auth-v1/KqT9eO20jisK3vgmktR5/2023-05-16T01:26:57Z/1800/host/bb701fa6cbaf0ba105d9eccaf7e0f58796234ddb56c9a09084913a7c8db304b0`,
            schema: {
              // default:
              //   'cc-auth-v1/KqT9eO20jisK3vgmktR5/2023-05-16T01:26:57Z/1800/host/bb701fa6cbaf0ba105d9eccaf7e0f58796234ddb56c9a09084913a7c8db304b0',
            },
          },
        ]),
        ApiQuery({
          required: false,
          name: CONSTANT_X_AUTHORIZATION,
          description: 'query / header 二选一',
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
