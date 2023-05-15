/*
 * @Author: hsycc
 * @Date: 2023-05-06 09:54:31
 * @LastEditTime: 2023-05-15 15:43:00
 * @Description:
 *
 */
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiHeaders } from '@nestjs/swagger';
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
        ApiHeaders([
          {
            name: 'host',
            // required: true,
            schema: { default: '' },
          },

          {
            name: 'x-cc-date',
            description: '签名时间',
            // required: true,
            schema: { default: new Date() },
          },
          {
            name: 'x-cc-expiration',
            description: '过期时间',
            required: false,
            schema: { default: new Date() },
          },
          {
            name: 'X-authorization',

            // required: true,
            description: `ak/sk 签名摘要`,
            schema: {
              default:
                'cc-auth-v1/2896b491041b0b3cee7e/20230513/host;content-type;content-length;content-md5;date;x-cc-date/436bce18bdf45df329e401f79a48a04f2146d08dd480ef2581a1615287e77249',
            },
          },
        ]),
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
