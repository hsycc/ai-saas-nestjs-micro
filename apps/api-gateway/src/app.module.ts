/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-08 06:34:33
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { JwtConfig, MicroConfig } from '@app/config';
import { CreateLoggerOption } from '@app/logger';

import { service } from './main';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GptModule } from './gpt/gpt.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig, JwtConfig],
      isGlobal: true,
    }),

    WinstonModule.forRoot(CreateLoggerOption({ service })),
    UserModule,
    GptModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
