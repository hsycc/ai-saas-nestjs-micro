import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from '@app/config';
import { LoggerOptions } from 'typeorm';
import { createLoggerOption } from '@app/common/logger';
import { WinstonModule } from 'nest-winston';
import { serviceName } from './main';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig.mysqlBase, appConfig.mysqlProduct],
      isGlobal: true,
    }),
    WinstonModule.forRoot(createLoggerOption(serviceName)),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('mysqlProduct.host'),
          port: config.get<number>('mysqlProduct.port'),
          username: config.get<string>('mysqlProduct.username'),
          password: config.get<string>('mysqlProduct.password'),
          database: config.get<string>('mysqlProduct.database'),

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
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class ProductSvcModule {}
