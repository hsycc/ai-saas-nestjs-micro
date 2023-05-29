/*
 * @Author: hsycc
 * @Date: 2023-05-26 14:21:00
 * @LastEditTime: 2023-05-29 22:08:35
 * @Description:
 *
 */
import { NacosConfigClient } from 'nacos';

import { NacosConfigOptions } from '../common/interface';
import { Inject } from '@nestjs/common';
import { NACOS_CONFIG_OPTIONS } from '../common/constants';

export class NacosConfigService {
  client: NacosConfigClient;
  constructor(
    @Inject(NACOS_CONFIG_OPTIONS)
    private nacosConfigOptions: NacosConfigOptions,
  ) {
    this.client = new NacosConfigClient({
      serverAddr: this.nacosConfigOptions.serverAddr,
      namespace: this.nacosConfigOptions.namespace || 'public',
      username: this.nacosConfigOptions.username || '',
      password: this.nacosConfigOptions.password || '',
      requestTimeout: nacosConfigOptions.requestTimeout || 6000,
    } as any);
    // this.client.getConfig('node-service', 'dev').then((res) => {
    //   console.log(res);
    // });
  }

  /**
   * 订阅所有配置 实例
   * nacos derby 模式下 订阅配置 不会出现 nacos 后台 的配置管理 、监听管理当中
   * 这个问题没有解决的话 使用 getConfig 替换订阅
   * @param {String} dataId - id of the data you want to subscribe
   * @param {String} group - group name of the data
   * @return
   */
  async subscribeConfig(dataId: string, group: string) {
    return new Promise((resolve) => {
      this.client?.subscribe(
        {
          dataId,
          group,
        },
        (content) => {
          console.log('[Nacos] 监听远程nacos配置1:', content);

          resolve(content);
        },
      );
    });
  }

  /**
   * 获取配置
   * nacos derby 模式下 订阅配置 不会出现 nacos 后台 的配置管理 、监听管理当中
   * 这个问题没有解决的话 使用 getConfig 替换订阅
   * @param {String} dataId - id of the data you want to subscribe
   * @param {String} group - group name of the data
   * @return
   */
  async getConfig(dataId: string, group: string) {
    return this.client.getConfig(dataId, group);
  }
}
