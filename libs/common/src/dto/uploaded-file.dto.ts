/*
 * @Author: hsycc
 * @Date: 2023-05-24 20:34:52
 * @LastEditTime: 2023-05-24 20:35:02
 * @Description:
 *
 */
import { ApiProperty } from '@nestjs/swagger';

export class UploadedFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
