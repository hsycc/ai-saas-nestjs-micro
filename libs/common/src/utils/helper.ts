/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:09
 * @LastEditTime: 2023-06-05 01:22:58
 * @Description:
 *
 */
import process from 'process';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export default class Utils {
  /**
   * 超时操作的封装
   * @param promises Promise[]
   * @param seconds the max time to wait (seconds)
   */
  static timeout(promises: Promise<any>[], seconds = 10): Promise<any> {
    return Promise.race([
      ...promises,
      new Promise((resolve) =>
        setTimeout(() => resolve('timeout'), seconds * 1000),
      ),
    ]);
  }
  /**
   * 是否是开发环境
   * @type {boolean}
   */
  static isDev = process.env.NODE_ENV !== 'production';

  /**
   * 是否是生产环境
   * @type {boolean}
   */
  static isProd = process.env.NODE_ENV === 'production';

  /**
   * 获取环境
   * @type {string}
   */
  static getEnv() {
    return process.env.NODE_ENV || 'local';
  }

  /**
   * 获取当前时间戳
   */
  static getTimestamp(isTen = true): number {
    const time = new Date().getTime();
    return isTen ? time / 1000 : time;
  }
  /**
   * 延迟函数
   */
  static sleep(time: number): Promise<boolean> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        if (timer) clearTimeout(timer);
        resolve(true);
      }, time * 1000);
    });
  }

  /**
   * genesis 的时间格式
   *
   * UTC time && without Zone flag
   */
  static timeWithoutZone(time?: dayjs.ConfigType): string {
    // return moment
    //   .utc(time ? time : new Date())
    //   .format(moment.HTML5_FMT.DATETIME_LOCAL_MS);

    return dayjs(time ? time : new Date())
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS');
  }
}
