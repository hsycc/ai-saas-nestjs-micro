import { IsEmail, IsString, MinLength } from 'class-validator';
import {
  LoginRequest,
  RegisterRequest,
  ValidateRequest,
} from '@proto/gen/user.pb';

export class LoginRequestDto implements LoginRequest {
  /**
   * 邮箱
   * @example 956366041@qq.com
   */
  @IsEmail()
  public readonly email: string;

  /**
   * 密码
   * @example 1234567890
   */
  @IsString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  /**
   * 邮箱
   * @example 956366041@qq.com
   */
  @IsEmail()
  public readonly email: string;

  /**
   * 密码
   * @example 1234567890
   */
  @IsString()
  @MinLength(8)
  public readonly password: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}
