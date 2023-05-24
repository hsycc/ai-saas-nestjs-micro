/*
 * @Author: hsycc
 * @Date: 2023-05-24 21:49:21
 * @LastEditTime: 2023-05-24 21:53:12
 * @Description:
 *
 */
import { ApiProperty } from '@nestjs/swagger';
import { CreateTranscriptionResponse } from '@proto/gen/ai.pb';

export class CreateTranscriptionResponseDto
  implements CreateTranscriptionResponse
{
  @ApiProperty()
  text: string;
}
