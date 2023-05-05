/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:18:23
 * @LastEditTime: 2023-05-05 18:21:08
 * @Description:
 *
 */
import { Controller, Inject } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('gpt')
export class GptController {
  constructor(
    @Inject(GptService)
    private readonly service: GptService,
  ) {}
}
