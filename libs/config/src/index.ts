/*
 * 配置文件
 * @Author: hsycc
 * @Date: 2023-02-21 13:24:34
 * @LastEditTime: 2023-04-24 15:23:23
 * @Description:
 *
 */

import jwtConfig from './jwt';
import ossConfig from './oss';
import mysqlBase from './mysql-base';
import mysqlAuth from './mysql-auth';
import mysqlOrder from './mysql-order';
import mysqlProduct from './mysql-product';
import redisConfig from './redis';
import microConfig from './micro';
import gtpConfig from './gtp';

export const appConfig = {
  jwtConfig,
  ossConfig,
  gtpConfig,
  redisConfig,
  microConfig,
  mysqlBase,
  mysqlAuth,
  mysqlOrder,
  mysqlProduct,
};
