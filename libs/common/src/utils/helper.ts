import * as process from 'process';
import * as moment from 'moment';
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
  static timeWithoutZone(time?: moment.MomentInput): string {
    return moment
      .utc(time ? time : new Date())
      .format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
  }
}
