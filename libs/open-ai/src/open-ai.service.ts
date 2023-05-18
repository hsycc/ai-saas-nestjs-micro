/*
 * @Author: hsycc
 * @Date: 2023-05-18 14:02:01
 * @LastEditTime: 2023-05-18 14:10:01
 * @Description:
 *
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { ConfigService } from '@nestjs/config';
import { AiConfigType } from '@lib/config';
@Injectable()
export class OpenAiService implements OnModuleInit {
  apiKey: string;
  openai: OpenAIApi;
  constructor(
    private readonly configService: ConfigService, // private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<AiConfigType>('AiConfig').apiKey;
  }
  onModuleInit() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }
}
