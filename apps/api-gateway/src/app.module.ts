import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { MicroConfig } from '@app/config';
import { CreateLoggerOption } from '@app/logger';

import { service } from './main';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MicroConfig],
      isGlobal: true,
    }),

    WinstonModule.forRoot(CreateLoggerOption({ service })),
    UserModule,
    GptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
