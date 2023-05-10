/*
 * @Author: hsycc
 * @Date: 2023-05-08 08:47:22
 * @LastEditTime: 2023-05-10 06:57:45
 * @Description:
 *
 */
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty()
  readonly accessToken: string;
}
