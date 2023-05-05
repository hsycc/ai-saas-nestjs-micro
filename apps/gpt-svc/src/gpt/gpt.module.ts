/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:18:23
 * @LastEditTime: 2023-05-05 18:17:44
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';
import { GptService } from './gpt.service';

@Module({
  imports: [],
  controllers: [GptController],
  providers: [GptService],
})
export class GptModule {}
