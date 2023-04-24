/*
 * Winston logger config options
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-22 16:13:41
 * @Description:
 *
 */

import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { LoggerOptions } from 'winston';

export const createLoggerOption = (service = 'nest-service') => {
  return {
    level: 'info',
    // format: winston.format.json(),
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(),
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.Console(),
      // - Write all logs with level `error` and below to `error.log`
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // - Write all logs with level `info` and below to `combined.log`
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  };
};

const loggerOptions: LoggerOptions = {
  level: 'info',
  // format: winston.format.json(),
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike(),
  ),
  defaultMeta: { service: 'nest-service' },
  transports: [
    new winston.transports.Console(),
    // - Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'combined.log' }),
  ],
};

export default loggerOptions;
