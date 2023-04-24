import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';

import { createLoggerOption } from '@app/common/logger';
import { LoggingInterceptor } from '@app/common/interceptors/logging.interceptor';
import { GrpcToHttpInterceptor } from '@app/grpc-exceptions';

export const serviceName = 'api-gateway';

const port = process.env.PORT || 9000;
const logger = WinstonModule.createLogger(createLoggerOption(serviceName));

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // https://github.com/gremo/nest-winston#use-as-the-main-nest-logger-also-for-bootstrapping
    logger,
  });

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

  app.useGlobalInterceptors(new GrpcToHttpInterceptor());
  // /* 统一请求成功的返回数据 */
  // app.useGlobalInterceptors(new TransformInterceptor());

  // /* 拦截全部的错误请求,统一返回格式 */
  // app.useGlobalFilters(new ApiGatewayExceptionFilter(logger));

  /** 统一打上时间戳, 统计接口耗时 */
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  /* 统一验证DTO 抛出指定异常过滤 */
  // app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /* Swagger */
  const config = new DocumentBuilder()
    .setTitle('ai-saas 云')
    .setDescription('API服务管理')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', bearerFormat: 'JWT', scheme: 'bearer' })
    .build();
  const options: SwaggerDocumentOptions = {
    // 去掉 moduleController 前缀
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
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
  logger.log(`process.env.NODE_ENV:${process.env.NODE_ENV}`, bootstrap.name);
  await app.listen(port);
  logger.log(
    `http://localhost:${port} ${serviceName} 服务启动成功`,
    bootstrap.name,
  );
}
bootstrap();
