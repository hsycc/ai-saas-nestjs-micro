/*
 * @Author: hsycc
 * @Date: 2023-05-27 00:32:44
 * @LastEditTime: 2023-05-27 00:32:55
 * @Description:
 *
 */
export class CustomLogger {
  trace = console.trace;
  // 取消 nacos 内置 logger.debug 的打印，去除心跳检测的打印
  debug() {}
  log = console.log;
  info = console.info;
  warn = console.warn;
  error = console.error;
}
