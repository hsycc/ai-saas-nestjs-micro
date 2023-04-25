/*
 * Winston logger config options
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-24 16:46:40
 * @Description:
 *
 */

import * as winston from 'winston';
import { utilities } from 'nest-winston';
import { LoggerOptions } from 'winston';

export type privateLoggerOption = {
  service?: string;
  defaultLevel?: string;
  combinedFile?: string;
  errorLogFile?: string;
  errorLevel?: string;
};

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
    // format: winston.format.json(),
    format: winston.format.combine(
      winston.format.timestamp(),
      utilities.format.nestLike(),
    ),
    defaultMeta: { service: option.service },
    transports: [
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
