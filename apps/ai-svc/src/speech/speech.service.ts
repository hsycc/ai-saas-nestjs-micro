/*
 * @Author: hsycc
 * @Date: 2023-05-24 18:12:06
 * @LastEditTime: 2023-05-24 23:12:01
 * @Description:
 *
 */
import { Metadata } from '@grpc/grpc-js';
import { FfmpegUtils } from '@lib/common/utils/ffmpeg';
import { GrpcInternalException } from '@lib/grpc';
import { OpenAiService } from '@lib/open-ai';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PRISMA_CLIENT_NAME_AI } from '@prisma/scripts/constants';
import { CreateTranscriptionRequest } from '@proto/gen/ai.pb';
import { CustomPrismaService } from 'nestjs-prisma';
import { CreateTranscriptionResponse } from 'openai';

@Injectable()
export class SpeechService {
  constructor(
    @Inject(PRISMA_CLIENT_NAME_AI)
    private prisma: CustomPrismaService<PrismaClient>,
    private readonly openAiService: OpenAiService,
  ) {}

  // TODO: 如何计算消耗的token, openai 的 api 没有返回token 消耗量
  async createTranscription(
    dto: CreateTranscriptionRequest,
    metadata?: Metadata,
  ): Promise<CreateTranscriptionResponse> {
    try {
      const { buffer, prompt = '', temperature = 0, language_code = '' } = dto;
      const inputStream = FfmpegUtils.arrayBufferToStream(buffer);
      // 压缩音频， 减少消耗
      const resizedBuffer = await FfmpegUtils.reduceBitrate(inputStream);
      const resizedStream = FfmpegUtils.bufferToReadableStream(
        resizedBuffer,
        'audio.mp3',
      );
      const res = await this.openAiService.openai.createTranscription(
        resizedStream as unknown as File,
        'whisper-1',
        prompt,
        'json',
        temperature,
        language_code,
        { timeout: 30000 },
      );
      return res.data;
    } catch (error) {
      throw new GrpcInternalException(error?.message);
    }
  }
}
