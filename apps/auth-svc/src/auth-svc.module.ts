import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';
import { WinstonModule } from 'nest-winston';
import { CreateLoggerOption } from '@app/logger';
import { MysqlBase, MysqlAuth, JwtConfig } from '@app/config';
import { service } from './main';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MysqlBase, MysqlAuth, JwtConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service })),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('MysqlAuth.host'),
          port: config.get<number>('MysqlAuth.port'),
          username: config.get<string>('MysqlAuth.username'),
          password: config.get<string>('MysqlAuth.password'),
          database: config.get<string>('MysqlAuth.database'),

          type: config.get<'mysql'>('MysqlBase.type'),
          synchronize: config.get<boolean>('MysqlBase.synchronize'), //  never true in production!
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
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthSvcModule {}
