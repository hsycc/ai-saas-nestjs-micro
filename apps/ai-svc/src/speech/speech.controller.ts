/*
 * @Author: hsycc
 * @Date: 2023-05-24 18:12:06
 * @LastEditTime: 2023-05-24 21:12:49
 * @Description:
 *
 */
import { Controller } from '@nestjs/common';
import { SpeechService } from './speech.service';
import { Metadata } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';
import { AI_SPEECH_SERVICE_NAME } from '@proto/gen/ai.pb';

@Controller()
export class SpeechController {
  constructor(private readonly speechService: SpeechService) {}

  @GrpcMethod(AI_SPEECH_SERVICE_NAME, 'createTranscription')
  private createTranscription(
    payload: {
      buffer: Buffer;
    },
    metadata: Metadata,
  ): Promise<any> {
    return this.speechService.createTranscription(payload, metadata);
  }
}
