/*
 * @Author: hsycc
 * @Date: 2023-04-19 12:44:18
 * @LastEditTime: 2023-06-04 23:36:57
 * @Description:
 *
 */
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import { HttpLoggingInterceptor, CreateLoggerOption } from '@lib/logger';
import {
  GrpcToHttpInterceptor,
  HttpClientExceptionFilter,
  HttpBodyValidationPipe,
} from '@lib/grpc';

import { GwModule } from './gw.module';
import { HttpTransformInterceptor } from '@lib/swagger';
import { MICRO_SERVER_NAME_GW } from './constants';
import { INestApplication } from '@nestjs/common';

const logger = WinstonModule.createLogger(
  CreateLoggerOption({
    defaultMeta: { application: MICRO_SERVER_NAME_GW },
  }),
);

async function bootstrap() {
  const { PORT, SWAGGER_ENABLE, NODE_ENV } = process.env;

  const app: INestApplication = await NestFactory.create(GwModule, {
    logger, // https://github.com/gremo/nest-winston#use-as-the-main-nest-logger-also-for-bootstrapping
  });

  if (SWAGGER_ENABLE === 'true') {
    /* Swagger */
    const config = new DocumentBuilder()
      .setTitle('ai-saas')
      .setDescription('API服务管理')
      .setVersion('1.0.0')
      .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
      .build();
    const options: SwaggerDocumentOptions = {
      // 去掉 moduleController 前缀
      operationIdFactory: (controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);

    // ExpressSwaggerCustomOptions 可以再 customOptions 配置Swagger自定义UI
    const customOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        // 刷新页面后保留身份验证令牌
        persistAuthorization: true,
      },
    };
    SwaggerModule.setup('api', app, document, customOptions);
  }

  /* 设置接口请求频率 */
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 1000, // 限制15分钟内最多只能访问1000次
    }),
  );
  /* 网络安全 - Web漏洞 */
  app.use(helmet());

  /* 允许跨域, 减少麻烦 */
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  /* 统一验证DTO 抛出指定异常过滤 */
  app.useGlobalPipes(new HttpBodyValidationPipe());

  /* 统一请求成功的返回数据 */
  app.useGlobalInterceptors(new HttpTransformInterceptor());

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new HttpLoggingInterceptor(logger));

  /* catchError rpcException return new HttpException */
  app.useGlobalInterceptors(new GrpcToHttpInterceptor(logger));

  /* HttpClientExceptionFilter 异常过滤器 */
  app.useGlobalFilters(
    new HttpClientExceptionFilter(logger, MICRO_SERVER_NAME_GW),
  );

  logger.log(`NODE_ENV:${NODE_ENV}`, bootstrap.name);

  // 开启shutdownHooks
  app.enableShutdownHooks();
  await app.listen(PORT);
  logger.log(
    `http://localhost:${PORT} ${MICRO_SERVER_NAME_GW} 服务启动成功`,
    bootstrap.name,
  );

  // 热更新
}
bootstrap();
