import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlBase, MysqlProduct } from '@app/config';
import { LoggerOptions } from 'typeorm';
import { CreateLoggerOption } from '@app/logger';
import { WinstonModule } from 'nest-winston';
import { service } from './main';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [MysqlBase, MysqlProduct],
      isGlobal: true,
    }),
    WinstonModule.forRoot(CreateLoggerOption({ service })),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          host: config.get<string>('MysqlProduct.host'),
          port: config.get<number>('MysqlProduct.port'),
          username: config.get<string>('MysqlProduct.username'),
          password: config.get<string>('MysqlProduct.password'),
          database: config.get<string>('MysqlProduct.database'),

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
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class ProductSvcModule {}
