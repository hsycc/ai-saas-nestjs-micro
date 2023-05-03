import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';
import { MysqlBase, MysqlGpt, MicroConfig } from '@app/config';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@app/logger';

import { service } from './main';
import { GptModule } from './gpt/gpt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MysqlBase, MysqlGpt, MicroConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service })),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('MysqlGpt.host'),
          port: config.get<number>('MysqlGpt.port'),
          username: config.get<string>('MysqlGpt.username'),
          password: config.get<string>('MysqlGpt.password'),
          database: config.get<string>('MysqlGpt.database'),

          type: config.get<'mysql'>('MysqlBase.type'),
          synchronize: config.get<boolean>('MysqlBase.synchronize'),
          charset: config.get<string>('MysqlBase.charset'),
          multipleStatements: config.get<boolean>(
            'MysqlBase.multipleStatements',
          ),
          connectionLimit: 10, // 连接限制
          /* with that options, every model registered through the `forFeature()` method will be automatically added to the `models` arrays of the configuration object */
          autoLoadEntities: true,
          logging: config.get<LoggerOptions>('MysqlBase.logging'),
          logger: config.get<any>('MysqlBase.logger'),
          dropSchema: config.get<boolean>('MysqlBase.dropSchema'),
          cache: config.get<boolean>('MysqlBase.cache'),
        };
      },
    }),
    GptModule,
  ],
  controllers: [],
  providers: [],
})
export class GptSvcModule {}
