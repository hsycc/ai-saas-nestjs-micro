/*
 * @Author: hsycc
 * @Date: 2023-05-26 16:42:27
 * @LastEditTime: 2023-05-29 00:59:16
 * @Description:
 *
 */

import { ModuleMetadata, Type } from '@nestjs/common';
import { ClientOptions } from 'nacos';
export interface NacosConfigOptions extends ClientOptions {
  /** nacos 地址 */
  serverAddr: string | string[] | any;
  /** namespace */
  namespace: string;

  username?: string;
  password?: string;

  requestTimeout?: number;
}

export interface NacosConfigOptionsFactory {
  createNacosConfigOptions(): Promise<NacosConfigOptions> | NacosConfigOptions;
}
export interface NacosConfigAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  inject?: any[];
  useExisting?: Type<NacosConfigOptionsFactory>;
  useClass?: Type<NacosConfigOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NacosConfigOptions> | NacosConfigOptions;
}

export interface NacosNamingOptions {
  /** enable */
  enable: boolean;

  /** nacos 地址 */
  serverAddr: string | string[];
  /** namespace */
  namespace: string;

  /** 分组名称 */
  group?: string;

  /* 配置名称 */
  dataId?: string;

  /** 注册服务名称 */
  registerServiceName: string;

  /** port */
  port: number;

  /** protocol */
  protocol: string;

  username?: string;
  password?: string;
}

export interface NacosNamingOptionsFactory {
  createNacosNamingOptions(): Promise<NacosNamingOptions> | NacosNamingOptions;
}
export interface NacosNamingAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  inject?: any[];
  useExisting?: Type<NacosNamingOptionsFactory>;
  useClass?: Type<NacosNamingOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<NacosNamingOptions> | NacosNamingOptions;
}
