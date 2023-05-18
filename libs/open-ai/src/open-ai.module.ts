/*
 * @Author: hsycc
 * @Date: 2023-05-18 14:02:01
 * @LastEditTime: 2023-05-18 14:17:33
 * @Description:
 *
 */
import { Global, Module } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';

@Global()
@Module({
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
