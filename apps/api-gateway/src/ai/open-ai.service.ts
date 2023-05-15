/*
 * @Author: hsycc
 * @Date: 2023-05-12 09:51:23
 * @LastEditTime: 2023-05-15 13:29:16
 * @Description:
 *
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from 'openai';
// import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';
import { Observable, lastValueFrom } from 'rxjs';
import { GptConfigType } from '@lib/config';
import { ChatDto } from './chat.dto';
@Injectable()
export class OpenaiService implements OnModuleInit {
  apiKey: string;
  openAi: OpenAIApi;
  constructor(
    private readonly configService: ConfigService, // private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<GptConfigType>('GptConfig').apiKey;
  }
  onModuleInit() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });

    this.openAi = new OpenAIApi(configuration);
  }

  public async chat(chatDto: ChatDto): Promise<any> {
    const params: CreateChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: ChatCompletionRequestMessageRoleEnum.System, content: '' },
        { role: ChatCompletionRequestMessageRoleEnum.User, content: '你好啊' },
      ],
    };
    return params;
    // return this.openAi.createChatCompletion(params);
  }

  public async sst() {
    // return this.openAi.createTranscription()
  }
}
