/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-19 08:20:29
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { GptController } from './gpt.controller';

@Module({
  controllers: [GptController],
  imports: [],
  providers: [],
})
export class GptModule {}
