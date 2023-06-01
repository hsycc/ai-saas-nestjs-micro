/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-06-02 03:29:37
 * @Description:
 *
 */
import { Request } from 'express';
import { Controller, Delete, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserModel } from '@proto/gen/user.pb';
import { ApiBaseResponse, BaseApiExtraModels } from '@lib/swagger';
import { AuthService } from './auth.service';
import { AccessTokenDto } from './dto';
import { Auth } from './decorators/auth.decorator';
import { GenerateClsMetadata } from './decorators/cls-metadata.decorator';

@ApiTags('auth')
@Controller('auth')
@BaseApiExtraModels(AccessTokenDto)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: save token in redis
  /**
   * 渠道用户登录
   */
  @Put('login')
  @Auth('local')
  private async login(@Req() req: Request) {
    return this.authService.login(req.user as UserModel);
  }

  // TODO: delete token in redis
  /**
   * 渠道用户登出
   */
  @Delete('logout')
  @Auth('jwt')
  @ApiBaseResponse()
  private async logout(@GenerateClsMetadata() generateClsMetadata) {
    console.log(generateClsMetadata);
  }
}
