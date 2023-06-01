<!--
 * @Author: hsycc
 * @Date: 2023-04-19 12:43:27
 * @LastEditTime: 2023-06-05 01:09:34
 * @Description:
 *
-->

# ai-saas-nestjs-micro

基于 nestjs prisma grpc 的分布式微服务系统架构设计

- [代码仓库](https://github.com/hsycc/ai-saas-nestjs-micro/tree/main)
- [文档-架构设计](https://cx0mxc554e.feishu.cn/docx/WjpPdDxcdoJv4hxTjeGcTWeOnXf)
- [文档-业务设计-潦草版](https://cx0mxc554e.feishu.cn/docx/To9JdneosoGUebxGLtrcVOrFnBc)
- [ak-sk 鉴权认证机制](./docs/ak-sk%E9%89%B4%E6%9D%83%E8%AE%A4%E8%AF%81%E6%9C%BA%E5%88%B6.md)
- [ak-sk 鉴权 typescript 实现示例](./docs/ak-sk%E9%89%B4%E6%9D%83typescript%E5%AE%9E%E7%8E%B0%E7%A4%BA%E4%BE%8B.ts)
- [其他文档](./docs)

## 环境依赖

- git
- pnpm 8.5.1
- node 16.19.1
- docker 20.10.7
- docker-compose 1.29.2
- postgresql 13.5

## 架构设计

- [x] 基础框架 nestJs (monorepo 模式)

- [x] 动态配置管理 ConfigModule

- [x] gRPC 微服务

  - [x] 动态配置以及注册调用
  - [x] proto 编译管理以及文档生成
  - [x] grpc 服务异常抛出过滤 (rpcExceptions)
    - [ ] 异常枚举值定义
  - [x] 参数检验拦截

- [x] prisma 数据库查询器

  - [x] 异常连接的捕获
  - [x] logger middleware
  - [ ] 软删除

- [x] swagger

  - 泛型约束

- [x] jwt 登录

  - [ ] jwt 主动注销实现 （ 借助 redis 实现 ）
  - ~~accessToken & refreshToken 双 token 设计~~ 标准的 oauth2.0 rfc 里面。refreshToken 是放在第三方服务器端的，accessToken 是放在第三方客户端的。出于对第三方客户端和链路安全的不信任。所以设计了双 token 机制，并且 accessToken 有效期很短。
    业务场景并不涉及三方鉴权授权，只使用单 token 设计

- [x] [鉴权设计](./apps/api-gateway/src/auth/)(鉴权逻辑均放在 api-gateway/auth 模块当中, 数据结构验证也放在 网关服务处理)

- [ ] 权限设计 (用户 权限表 租户概念 计费 升级扩容)

  - [x] local 本地化策略(登录策略)
  - [x] jwt 登录鉴权
  - [x] ak/ks ai 调用鉴权 （参考 [百度云市场](https://cloud.baidu.com/doc/Reference/s/Njwvz1wot)）
  - [ ] 权限鉴权

- [x] [nestjs-grpc-prisma 微服务架构 gen-cli 快速开发新服务的工具库](./scripts/gen-cli.md)

- [x] [nacos](./docs/nacos.md) (Traefik 配合 docker/k8s 使用， nacos 除了配置中心，其他就不是很有必要了)

  - [x] 配置中心 (可修改的动态配置管理， 服务运行的静态配置用.env 管理)
  - [x] 健康检查 (自带心跳检测)
  - [x] 软负载均衡
  - [ ] 网关监控 grafana
  - [ ] 熔断限流

- [ ] 全链路日志管理

  - [x] 日志打印 [nest-winston](https://github.com/gremo/nest-winston#use-as-the-main-nest-logger-also-for-bootstrapping)
  - [x] 全链路日志标记，元数据透传 [nestjs-cls](https://papooch.github.io/nestjs-cls/introduction/installation)（node 其他: cls-hooked）
  - [x] 链路追踪 zipkin (其他: Jaeger)
  - [ ] 日志分析工具 elk / skywalking

- [x] 运维部署

  - [x] pm2

  - [x] docker-compose 编排 (管理 postgresql/redis, 微服务)

    - [x] dockerfile 编码
    - [x] docker-compose 编码
    - [ ] docker Swarm 集群管理

  - [ ] k8s

- [Traefik](https://shanyue.tech/op/traefik.html#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)

  - 反向代理
  - 服务发现
  - 负载均衡
  - 流量控制
  - 与 docker 完美集成，基于 container label 的配置

- 压力测试

- 监控

## 业务设计

- [ ] 账号体系(待完善)
  - [x] 渠道用户管理
  - [ ] 用户权限
  - [ ] 接入 sms 短信 以及验证码 登录注册
- [ ] ai 服务
  - [x] 会话模型管理
  - [ ] openai(chat-gpt) 能力封装
    - [x] /ai/invoke/chat_completion 会话聊天接口
      - [ ] 引入 redis 做 gpt 接口调用的限制管理
      - [ ] 引入 mongo 做 gpt token 消耗的 的账单记录
    - [x] /ai/invoke/stt 语音转文字

## 如何运行(开发环境)

```bash

# 编辑配置文件
vim .env.production

pnpm install

# 构建 prisma client
pnpm run prisma:generate

# docker 启动 postgresql (如果开发环境没有安装启动 postgresql )
# 等价于  "docker-compose -f docker-compose.db.yml up -d",
pnpm run docker:db

# 预设数据
pnpm run seed

## 启动网关服务
pnpm run start api-gateway


## 启动其他服务
pnpm run start user-svc

pnpm run start ai-svc

```

## Tree

```
      ├── scripts                   shell 命令
      ├── docs                      使用的技术栈的文档归纳
      ├── _proto                    grpc 依赖
      ├── prisma                    数据库查询器管理
      │ ├── migrations              prisma 命令生成的 sql 明细
      │
      ├── apps                      服务目录
      │ ├── api-gateway               网关服务
      │ ├ ├── auth                      网关鉴权相关
      │ ├── ai-svc                    ai服务相关
      │ └── user-svc                  用户服务
      │
      ├── libs                      依赖库管理
      │ ├── common                    公共函数相关
      │ ├── config                    配置管理
      │ ├── grpc                      封装 rpc 异常抛出拦截、管道数据校验
      │ ├── logger                    logger 日志打印器的封装
      │ ├── swagger                   swagger ApiResponse 泛型封装
      │ ├── nacos                     nacos 服务注册发现， 配置获取相关
      │ └── open-ai                   open-ai(chat-gpt) 的能力封装

```

## 备忘

- prisma

  - 事务
  - 锁
  - prisma model 硬编码 成 proto3 的 message 脚本
  - 研究下 postgresql 默认显示的时区问题, 设置为 utc-8, prisma 存储的日期格式是有记录时区偏移量[https://github.com/prisma/prisma/issues/5051]

- proto
  - proto 定义的字段为数组且值为空， 反序列化时 该字段会丢失，研究下怎么解决

## 租户概念 (from chatgpt)

在 SaaS（软件即服务）系统中，"租户"是指使用该系统的独立实体或组织。每个租户在 SaaS 系统中都被视为一个独立的客户，并拥有自己的数据和配置。租户的概念旨在将多个客户的数据和操作进行隔离，以确保安全性、隐私性和多租户环境的可扩展性。

以下是关于租户的一些重要概念和特点：

数据隔离：每个租户的数据都是相互隔离的，一个租户无法访问另一个租户的数据。这确保了数据的安全性和隐私性。

安全性和权限控制：租户可以根据其需要分配访问权限和角色。这样，只有经过授权的用户才能访问他们所属租户的数据和功能。

定制化和配置：租户可以根据其特定需求进行自定义和配置，例如品牌化、主题、工作流程等。这样，每个租户可以根据自身要求来个性化使用系统。

多租户架构：SaaS 系统采用多租户架构，使得多个租户可以在同一个系统实例中运行。这种共享的架构可以提高资源利用率，并降低维护成本。

计费和订阅：租户通常基于订阅模式使用 SaaS 系统，根据其选择的服务套餐或功能来支付相应费用。这种灵活的计费模式允许租户根据需求选择适当的服务级别。

租户的概念在 SaaS 系统中是核心的，它为不同的客户提供了安全、可扩展和个性化的体验。通过对租户进行隔离，SaaS 提供商能够同时为多个客户提供服务，并为每个客户提供独立的环境和控制权

## 日志分析工具 (from chatgpt)

Zipkin、SkyWalking 和 ELK（Elasticsearch、Logstash、Kibana）是三个不同的工具，用于不同的日志和跟踪需求。

Zipkin: Zipkin 是一个专注于分布式跟踪的工具。它可以帮助你追踪请求在多个微服务之间的流转路径和执行时间。Zipkin 收集跟踪数据，并提供一个用户界面用于查看和分析跟踪信息。Zipkin 通常与应用程序进行集成，以捕获请求的跟踪信息并将其发送到 Zipkin 服务器。

SkyWalking: SkyWalking 是一个分布式系统的跟踪和性能监测工具。它提供了分布式追踪、性能指标监测、系统拓扑可视化等功能。SkyWalking 可以帮助你深入了解分布式系统的运行情况和性能瓶颈，并提供实时监控和报警功能。

ELK Stack: ELK Stack 是一个日志管理和分析解决方案，由 Elasticsearch、Logstash 和 Kibana 组成。Elasticsearch 用于存储和索引日志数据，Logstash 用于收集、处理和转发日志数据，Kibana 用于搜索、可视化和分析日志数据。ELK Stack 可以帮助你集中管理和分析各种日志数据，并提供实时监控和报警功能。

Zipkin 和 SkyWalking 都专注于分布式系统的跟踪，而 ELK Stack 则专注于日志管理和分析。你可以根据你的需求选择使用其中的一个或结合使用它们。例如，你可以使用 Zipkin 或 SkyWalking 来追踪和监测请求的流转和性能，然后将跟踪数据发送到 ELK Stack 进行日志存储和分析，以实现更全面的日志和性能监控。

请注意，这些工具的集成和使用方式可能会因你的具体需求和技术栈而有所不同。在实际应用中，你可能需要进行一些自定义和配置，以确保它们与你的系统和业务需求相匹配。

## Traefik (from chatgpt)

Traefik 是一款开源的反向代理和负载均衡器，特别适用于微服务架构和容器化环境。它提供了简单而灵活的方式来动态路由和转发请求到不同的后端服务。

Traefik 的主要特点和功能包括：

反向代理和负载均衡：Traefik 可以作为反向代理服务器，接收客户端请求并将其转发到后端服务。它支持多种负载均衡算法，如轮询、最少连接等，以确保请求被均匀分发到后端服务。

动态配置和自动服务发现：Traefik 可以与容器编排平台（如 Docker、Kubernetes）集成，自动发现和注册新的服务。它可以监听容器平台的事件，根据服务的动态变化自动更新路由规则，无需手动配置。

支持多种后端服务：Traefik 支持多种后端服务类型，包括 Docker 容器、Kubernetes 服务、虚拟机、静态文件等。它可以根据服务的标签或元数据进行智能路由，并提供灵活的配置选项。

支持 HTTPS 和 SSL/TLS：Traefik 提供了内置的 HTTPS 支持，并支持自动管理 SSL/TLS 证书。它可以与 Let's Encrypt 等证书颁发机构集成，实现自动证书签发和更新。

动态配置和可扩展性：Traefik 的配置可以通过动态配置文件、命令行参数、环境变量等多种方式进行设置。它还提供了丰富的插件和中间件支持，可以实现请求转换、重定向、身份验证等高级功能。

Traefik 的设计目标是简单、易用和高性能。它提供了直观的用户界面和实时监控面板，可用于查看当前的路由规则和服务状态。Traefik 广泛应用于云原生和微服务架构中，为应用程序提供可靠的反向代理和负载均衡能力，并简化了服务的动态管理和部署。
