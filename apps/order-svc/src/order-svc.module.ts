import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerOptions } from 'typeorm';
import { appConfig } from '@app/config';
import { WinstonModule } from 'nest-winston';
import { createLoggerOption } from '@app/common/logger';

import { serviceName } from './main';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig.mysqlBase, appConfig.mysqlOrder, appConfig.microConfig],
      isGlobal: true,
    }),
    WinstonModule.forRoot(createLoggerOption(serviceName)),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('mysqlOrder.host'),
          port: config.get<number>('mysqlOrder.port'),
          username: config.get<string>('mysqlOrder.username'),
          password: config.get<string>('mysqlOrder.password'),
          database: config.get<string>('mysqlOrder.database'),

          type: config.get<'mysql'>('mysqlBase.type'),
          synchronize: config.get<boolean>('mysqlBase.synchronize'),
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
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class OrderSvcModule {}
