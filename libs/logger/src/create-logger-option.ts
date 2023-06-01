/*
 * Winston logger config options
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-06-05 00:03:27
 * @Description:
 *
 */

import winston, { LoggerOptions } from 'winston';
import { utilities } from 'nest-winston';
import { ClsServiceManager } from 'nestjs-cls';
import { hostname } from 'os';
import { context, trace } from '@opentelemetry/api';

export type privateLoggerOption = {
  defaultMeta?: Record<string, string>;
  service?: string;
  defaultLevel?: string;
  combinedFile?: string;
  errorLogFile?: string;
  errorLevel?: string;
};

export const formatFormCls = winston.format((info) => {
  const cls = ClsServiceManager.getClsService();

  info.requestId = cls.get('requestId') || cls.getId();
  info.userId = cls.get('userId');
  info.tenantId = cls.get('tenantId');

  const spanContext = trace.getSpan(context.active())?.spanContext();
  info.traceId = spanContext?.traceId;
  return info;
});

export const CreateLoggerOption = (
  option: privateLoggerOption,
): LoggerOptions => {
  const options: privateLoggerOption = {
    defaultLevel: 'info',
    combinedFile: 'combined.log',
    errorLogFile: 'error.log',
    errorLevel: 'error',
    service: 'default-service',
    ...option,
  };
  return {
    level: option.defaultLevel,
    format: winston.format.combine(
      formatFormCls(),
      winston.format.timestamp(),
      // default
      utilities.format.nestLike('NestWinston', {
        colors: true,
        prettyPrint: false,
      }),
    ),
    defaultMeta: {
      serverName: hostname(), // 所在服务器

      ...options?.defaultMeta,

      // 指定日志类型，如 SQL / Request / Access
      //  label
    },
    transports: [
      // TODO: 指定过期时间
      new winston.transports.Console(),
      // - Write all logs with level `error` and below to `error.log`
      new winston.transports.File({
        filename: options.errorLogFile,
        level: options.errorLevel,
      }),
      // - Write all logs with level `info` and below to `combined.log`
      new winston.transports.File({ filename: options.combinedFile }),
    ],
  };
};
