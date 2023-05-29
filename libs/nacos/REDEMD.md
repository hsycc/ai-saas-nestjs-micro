<!--
 * @Author: hsycc
 * @Date: 2023-05-09 05:09:29
 * @LastEditTime: 2023-05-29 05:44:14
 * @Description:
 *
-->

# nacos

- [nacos](https://nacos.io/)
- [nacos docker 快速部署](https://github.com/paderlol/nacos-docker.git)
- [nacos 部署](https://nacos.io/zh-cn/docs/deployment.html)
- [nacos 监控](https://nacos.io/zh-cn/docs/monitor-guide.html)

## nacos-naming.module

基于 NestJs9.0 以及 nacos2.2.2
用于微服务中服务发现注册，注销，以及订阅服务等。

> 要求：
>
> 需要开启 nest 框架中的 shutdownHooks,再应用的生命周期中做注册以及注销。
> 注册服务的端口号和应用的端口号一致

1. pnpm install nacos

2. 在.env 文件中增加如下配置,注意：NestJs 获取.env 文件需要添加 ConfigModule，具体参考[官方文档](https://docs.nestjs.cn/8/techniques?id=%e9%85%8d%e7%bd%ae)

```typescript ConfigModule示例（在根 module 中导入配置）
ConfigModule.forRoot({
    envFilePath: ['.env'],
    load: [NacosConfig]，
    isGlobal: true,
})
```

```bash .env 文件示例
# nacos 是否启用
NACOS_ENABLE = true
## 配置nacos服务地址
NACOS_SERVER_ADDR = 127.0.0.1:8848

## 配置nacos的空间名称（服务也是注册到此空间）
NACOS_NAMESPACE = public

## 配置nacos的分组名称
NACOS_GROUP = dev

## nacos 开启登录鉴权的账号密码
NACOS_USERNAME = ''
NACOS_PASSWORD = ''

```

```typescript ConfigModule register
import { registerAs } from '@nestjs/config';

export const NacosConfig = registerAs('NacosConfig', () => ({
  enable: process.env.NACOS_ENABLE === 'true',
  serverAddr: process.env.NACOS_SERVER_ADDR,
  namespace: process.env.NACOS_NAMESPACE,
  group: process.env.NACOS_GROUP,
  username: process.env.NACOS_USERNAME,
  password: process.env.NACOS_PASSWORD,
}));
```

3. 开启 shutdownHooks

```typescript
app.enableShutdownHooks();
```

4. 在根 module 导入 NacosNamingModule, 默认全局注册

```typescript
NacosNamingModule.forRootAsync({
  global: true,
  useFactory: (config: ConfigService) => {
    const NacosConfig = config.get<NacosConfigType>('NacosConfig');

    return {
      enable: NacosConfig.enable,
      serverAddr: NacosConfig.serverAddr,
      namespace: NacosConfig.namespace,
      group: NacosConfig.group,
      registerServiceName: MICRO_SERVER_NAME_GW,
      protocol: 'http',
      port: 9000,
      username: NacosConfig.username,
      password: NacosConfig.password,
    };
  },
  inject: [ConfigService],
});

//  NacosNamingService 在 onApplicationBootstrap, onApplicationShutdown 的生命周期会自动进行服务发现注册，注销
```

5. 订阅上报 nacos 的 grpc 服务的调用示例

```typescript
export class Service {
  private clients: ClientGrpc[] = [];

  constructor(nacosNamingService: NacosNamingService) {
    // 订阅反馈健康的 grpc 服务
    nacosNamingService.subscribeObservableHealthGrpcClientsCb(
      {
        serviceName: '订阅的rpc服务名称',
        groupName: 'nacos 分组名称， 可选',
        package: 'grpc package 名称',
        protoPath: 'grpc proto 路径',
        connectServerWithOutNacos: '', // 如果没有启用 nacos, 需要传入 grpc 的服务地址, 多个地址用 ',' 分隔
      },
      (clients) => {
        this.clients = clients;
      },
    );
  }

  get grpcServiceClient(): grpcServiceClient {
    // 软负载均衡
    if (this.clients.length === 0) {
      throw new ServiceUnavailableException();
    }
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex].getService<grpcServiceClient>(
      USER_SERVICE_NAME,
    );
  }
}
```

## nacos-config.module 获取

nacos 配置管理

1. pnpm install nacos

2. 在.env 文件中增加如下配置,注意：NestJs 获取.env 文件需要添加 ConfigModule，具体参考[官方文档](https://docs.nestjs.cn/8/techniques?id=%e9%85%8d%e7%bd%ae)

```typescript ConfigModule示例（在根 module 中导入配置）
ConfigModule.forRoot({
    envFilePath: ['.env'],
    load: [NacosConfig]，
    isGlobal: true,
})
```

```bash .env 文件示例
# nacos
NACOS_ENABLE = true
## 配置nacos服务地址
NACOS_SERVER_ADDR = 127.0.0.1:8848

## 配置nacos的空间名称（服务也是注册到此空间）
NACOS_NAMESPACE = public

## 配置nacos的分组名称
NACOS_GROUP = dev

## nacos 开启登录鉴权的账号密码
NACOS_USERNAME = ''
NACOS_PASSWORD = ''

```

```typescript ConfigModule register
import { registerAs } from '@nestjs/config';

export const NacosConfig = registerAs('NacosConfig', () => ({
  enable: process.env.NACOS_ENABLE === 'true',
  serverAddr: process.env.NACOS_SERVER_ADDR,
  namespace: process.env.NACOS_NAMESPACE,
  group: process.env.NACOS_GROUP,
  username: process.env.NACOS_USERNAME,
  password: process.env.NACOS_PASSWORD,
}));
```

3. 在 所需 module 导入 NacosNamingModule, 默认不全局注册

```typescript
NacosConfigModule.NacosConfigModule({
  useFactory: (config: ConfigService) => {
    const NacosConfig = config.get<NacosConfigType>('NacosConfig');
    return {
      serverAddr: NacosConfig.serverAddr,
      namespace: NacosConfig.namespace,
      username: NacosConfig.username,
      password: NacosConfig.password,
      requestTimeout: 6000,
    };
  },
  inject: [ConfigService],
}),
```

4. 订阅配置/ 获取配置

```typescript
// 订阅
nacosConfigOptions.client.subscribe(
  { dataId: 'Data Id', group: 'Group name' },
  (content) => {
    console.log('[Nacos] 监听远程nacos配置1:', content);
  },
);

// 获取
const config = await nacosConfigOptions.getConfig('Data Id', 'Group name');
```
