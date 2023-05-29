/*
 * @Author: hsycc
 * @Date: 2023-05-26 14:21:00
 * @LastEditTime: 2023-05-29 05:34:24
 * @Description:
 *
 */
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { NacosNamingClient } from 'nacos';
import { address } from 'ip';

import { CustomLogger } from '../common/custom-logger';
import { NacosNamingOptions } from '../common/interface';
import {
  ClientGrpc,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { NACOS_NAMING_OPTIONS } from '../common/constants';

@Injectable()
export class NacosNamingService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private serverAddr: string | string[];
  private namespace: string;
  private group: string;
  private registerServiceName: string;
  private port: number;

  private username?: string;
  private password?: string;

  private protocol?: string;

  private ip: string;

  private enable: boolean;

  client: NacosNamingClient;
  constructor(
    @Inject(NACOS_NAMING_OPTIONS)
    private nacosNamingOptions: NacosNamingOptions,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {
    this.serverAddr = this.nacosNamingOptions.serverAddr;
    this.namespace = this.nacosNamingOptions.namespace || 'public';
    this.group = this.nacosNamingOptions.group || 'DEFAULT_GROUP';

    this.registerServiceName = this.nacosNamingOptions.registerServiceName;
    this.port = this.nacosNamingOptions.port;

    this.protocol = this.nacosNamingOptions.protocol || '';

    this.username = this.nacosNamingOptions.username || '';
    this.password = this.nacosNamingOptions.password || '';

    // TODO:check docker 桥接网络下的 ip 获取
    // 获取本机ip
    this.ip = address();
    this.enable = this.nacosNamingOptions.enable || false;

    if (this.enable) {
      this.client = new NacosNamingClient({
        logger: new CustomLogger() as Console,
        serverList: this.serverAddr,
        namespace: this.namespace,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        username: this.username,
        password: this.password,
      });
    }
  }

  get subscribe() {
    return this.client?.subscribe;
  }
  get unSubscribe() {
    return this.client?.unSubscribe;
  }

  /**
   * 应用关闭时触发, 取消服务发现
   */
  async onApplicationShutdown(signal?: string) {
    if (this.enable) {
      if (
        'SIGINT' === signal ||
        'SIGBREAK' === signal ||
        'SIGTERM' === signal
      ) {
        this.logger.log(
          `application close:${signal}, deregister nacos instance...`,
          NacosNamingService.name,
        );
        // deregister instance
        await this.client.deregisterInstance(this.registerServiceName, {
          ip: this.ip,
          port: this.port,
        });
      }
    }
  }

  /**
   * 应用启动时 注册服务发现
   */
  async onApplicationBootstrap() {
    if (this.enable) {
      this.logger.log(
        'application init, registerInstance nacos instance...',
        NacosNamingService.name,
      );

      await this.client.ready();

      // registry instance
      await this.client.registerInstance(
        this.registerServiceName,
        {
          ip: this.ip,
          port: this.port,
          metadata: {
            protocol: this.protocol,
          },
        } as any,
        this.group,
      );
    }
  }

  /**
   * 订阅 grpc 服务,监听返回该 grpc 服务所有健康的 ClientGrpc 实例的 Observable
   * @param grpcClientOptions
   * - @param serviceName 需要调用的服务名
   * - @param groupName 分组名称，如果传空默认DEFAULT_GROUP
   * - @param package  proto package 名称
   * - @param protoPath proto protoPath
   */
  subscribeObservableHealthGrpcClientsCb(
    grpcClientOptions: {
      serviceName: string;
      groupName?: string;
      package: string;
      protoPath: string;

      connectServerWithOutNacos?: string;
    },
    callBack: (clients: ClientGrpc[]) => void,
  ) {
    if (this.enable) {
      const groupName = grpcClientOptions.groupName || this.group;
      this.client.subscribe(
        {
          serviceName: grpcClientOptions.serviceName,
          groupName,
        },
        (allInstanceList = []) => {
          const healthInstanceList = allInstanceList
            .filter(
              (v: any) =>
                v.healthy && v.enabled && v.metadata?.protocol === 'grpc',
            )
            .map((c: any) => {
              return ClientProxyFactory.create({
                transport: Transport.GRPC,
                options: {
                  url: `${c.ip}:${c.port}`,
                  package: grpcClientOptions.package,
                  protoPath: grpcClientOptions.protoPath,
                  loader: {
                    keepCase: true,
                  },
                },
              });
            });
          callBack && callBack(healthInstanceList);
        },
      );
    } else {
      return (
        grpcClientOptions.connectServerWithOutNacos?.split(',').map((v) => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              url: v,
              package: grpcClientOptions.package,
              protoPath: grpcClientOptions.protoPath,
              loader: {
                keepCase: true,
              },
            },
          });
        }) || []
      );
      // 返回 单体示例
    }
  }
}
