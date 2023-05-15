/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-15 13:09:19
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { GptConfig, JwtConfig, MicroConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';

import { service } from './main';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GptModule } from './gpt/gpt.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig, JwtConfig, GptConfig],
      isGlobal: true,
    }),

    WinstonModule.forRoot(CreateLoggerOption({ service })),
    AuthModule,
    UserModule,
    AiModule,
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
