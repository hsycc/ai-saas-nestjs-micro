/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-05-29 21:52:38
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { AiConfig, JwtConfig, MicroConfig, NacosConfig } from '@lib/config';
import { CreateLoggerOption } from '@lib/logger';

import { GwController } from './gw.controller';
import { GwService } from './gw.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { GptModule } from './gpt/gpt.module';

import { HealthModule } from './health/health.module';

import { MICRO_SERVER_NAME_GW } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AiConfig, JwtConfig, MicroConfig, NacosConfig],
      expandVariables: true,
      envFilePath: ['.env.production', '.env'],
    }),

    WinstonModule.forRoot(
      CreateLoggerOption({
        service: MICRO_SERVER_NAME_GW,
      }),
    ),

    HealthModule,
    AuthModule,
    UserModule,
    AiModule,
    GptModule,
  ],
  controllers: [GwController],
  providers: [GwService],
})
export class GwModule {}
