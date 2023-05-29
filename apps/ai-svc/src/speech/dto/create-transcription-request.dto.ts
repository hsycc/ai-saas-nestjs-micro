/*
 * @Author: hsycc
 * @Date: 2023-05-24 21:49:25
 * @LastEditTime: 2023-05-27 20:27:34
 * @Description:
 *
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateTranscriptionRequest } from '@proto/gen/ai.pb';

import { UploadedFileDto } from '@lib/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTranscriptionRequestDto extends UploadedFileDto {
  @ApiProperty({
    example: '',
    description:
      'An optional text to guide the model\\&#39;s style or continue a previous audio segment. The [prompt](/docs/guides/speech-to-text/prompting) should match the audio language.',
  })
  @IsOptional()
  @IsString()
  prompt?: string;

  @ApiProperty({
    example: 0,
    description:
      ' The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use [log probability](https://en.wikipedia.org/wiki/Log_probability) to automatically increase the temperature until certain thresholds are hit.',
  })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiProperty({
    example: '',
    description: ` The language of the input audio. Supplying the input language in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format will improve accuracy and latency.
    * @param {*} [options] Override http request option.`,
  })
  @IsOptional()
  @IsString()
  language_code?: string;
}
