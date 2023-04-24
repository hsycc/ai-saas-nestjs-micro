import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';
import { WinstonModule } from 'nest-winston';
import { createLoggerOption } from '@app/common/logger';
import { appConfig } from '@app/config';
import { serviceName } from './main';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig.mysqlBase, appConfig.mysqlAuth, appConfig.jwtConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(createLoggerOption(serviceName)),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('mysqlAuth.host'),
          port: config.get<number>('mysqlAuth.port'),
          username: config.get<string>('mysqlAuth.username'),
          password: config.get<string>('mysqlAuth.password'),
          database: config.get<string>('mysqlAuth.database'),

          type: config.get<'mysql'>('mysqlBase.type'),
          synchronize: config.get<boolean>('mysqlBase.synchronize'), //  never true in production!
          charset: config.get<string>('mysqlBase.charset'),
          multipleStatements: config.get<boolean>(
            'mysqlBase.multipleStatements',
          ),
          connectionLimit: 10, // 连接限制
          /* with that options, every model registered through the `forFeature()` method will be automatically added to the `models` arrays of the configuration object */
          autoLoadEntities: true,
          logging: config.get<LoggerOptions>('mysqlBase.logging'),
          logger: config.get<any>('mysqlBase.logger'),
          dropSchema: config.get<boolean>('mysqlBase.dropSchema'),
          cache: config.get<boolean>('mysqlBase.cache'),
        };
      },
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthSvcModule {}
