/*
 * @Author: hsycc
 * @Date: 2023-05-12 09:51:23
 * @LastEditTime: 2023-05-12 10:32:57
 * @Description:
 *
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { Observable, lastValueFrom } from 'rxjs';
import { GptConfigType } from '@lib/config';
@Injectable()
export class OpenaiService implements OnModuleInit {
  apiKey: string;
  openAi: OpenAIApi;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<GptConfigType>('GptConfig').apiKey;
  }
  onModuleInit() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });

    this.openAi = new OpenAIApi(configuration);
  }

  public async chat() {
    // return this.openAi.createChatCompletion()
  }

  public async sst() {
    // return this.openAi.createTranscription()
  }
}
