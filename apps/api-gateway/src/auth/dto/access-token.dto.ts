/*
 * @Author: hsycc
 * @Date: 2023-05-08 08:47:22
 * @LastEditTime: 2023-05-08 08:49:10
 * @Description:
 *
 */
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty()
  readonly access_token: string;
}
