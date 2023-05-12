<!--
 * @Author: hsycc
 * @Date: 2023-04-19 12:43:27
 * @LastEditTime: 2023-05-11 15:46:25
 * @Description:
 *
-->

## ai-saas-nestjs-micro

###

- [x] nest-cli monorepo mode create service and library

  - apps 服务目录
  - libs 公共依赖目录

  ```
  nest g app user-svc
  nest g library common
  // todo: 单独构建 library  "build": "tsup index.ts --format cjs,esm --dts",
  ```

- [x] 动态配置管理

- [x] 注册 gRPC 微服务
- [x] gRPC 动态配置
- [x] protoc 编译 pb 文件以及 docs

  ```bash
    # 编译 proto
    make proto-all
    make proto-user
    make ...

    # 构建 proto 文档
    bash script/generate-proto-docs.sh

  ```

- [x] swagger;
- [x] 切换成 prisma/ postgresql
- [ ] docker
  - [x] dockerfile
  - [x] docker-compose
  - [ ] docker Swarm 集群部署
- [x] jwt
  - TODO: 安全拓展
  - [ ] accessToken & refresh 刷新
  - [ ] logout redis remove jwt sign
- 调用鉴权设计
  - [x] local 本地化策略
  - [x] jwt 登录鉴权
  - [ ] ai-api 调用鉴权
- [ ] 网关监控 健康检查 熔断限流
- [ ] 缓存
- [ ] 幂等设计
- [ ] 日志管理
- [ ] 链路追踪
- [ ] 配置中心 nacos

## 业务设计

- [x] 账号体系设计
  - [x] 渠道用户管理
  - [ ] 接入 sms 短信 以及验证码服务
  - [ ] 权限设计
- [ ] gpt 会话模型管理
- [ ] chat-gpt 服务设计

## tree

- [x] rpc
      grpc-server 和 http-client 管道道数据校验、日志打印、异常抛出、异常状态码枚举管理的封装
  - ```
    ├── error
    │   ├── gen-rpc-exception-error.ts
    ├── exceptions
    │   ├── aborted.exception.ts
    │   ├── already-exists.exception.ts
    │   ├── cancelled.exception.ts
    │   ├── internal.exception.ts
    │   ├── invalid-argument.exception.ts
    │   ├── not-found.exception.ts
    │   ├── permission-denied.exception.ts
    │   ├── resource-exhausted.exception.ts
    │   ├── unauthenticated.exception.ts
    │   ├── unavailable.exception.ts
    │   └── unknown.exception.ts
    ├── filters
    │   ├── grpc-server-exception.filter.ts
    │   ├── http-client-exception.filter.ts
    ├── interceptors
    │   ├── grpc-to-http.interceptor.ts
    │   ├── http-to-grpc.interceptor.ts
    │   ├── http-transform.interceptor.ts
    ├── pipes
    │   ├── grpc-body-validation.pipe.ts
    │   ├── http-body-validation.pipe.ts
    └── utils
        ├── error-object.ts
        └── http-codes-map.ts
    ```

## 备忘

- 鉴权逻辑均放在 api-gateway/auth 模块当中, 数据结构验证也放在 网关服务处理
- [ ] 设计 ak、sk 签名流程
- [ ] ak/sk 自定义 Passport 插件编码 AkSkStrategy
- [ ] 改写 rpcExceptions 的抛出逻辑
- [ ] rpcExceptions 异常枚举值定义
- [ ] rpc 服务挂掉的异常捕获
- [ ] rpc 序列化 JSON.parse 的异常捕获
- [ ] prisma 中间件 （logger 异常抛出, findFirstOrThrow ）
- [ ] proto 定义的字段为数组且值为空， 反序列化时 该字段会丢失，研究下怎么解决
- [ ] proto return google.protobuf.Empty 的 详细了解
- [ ] proto prisma 分页查询处理
- [ ] .prisma 软删除设计
- [ ] prisma model 硬编码 成 proto3 的 message
- [ ] postgresql 默认显示的时区问题, 设置为 utc-8
- [ ] https://github.com/prisma/prisma/issues/5051 prisma 是有记录偏移量

## openai

chat/completions

system 类的聊天消息通常是指代当前聊天会话的全局信息，例如聊天会话的 ID、当前的时间戳、当前的聊天主题等。这些信息对于聊天机器人来说非常重要，因为它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。

另一方面，assistant 类的聊天消息通常是指代聊天机器人自身的信息，例如聊天机器人的名称、聊天机器人的介绍、聊天机器人的提示等。这些信息通常是由聊天机器人自己发出的，用于与用户进行互动，并帮助用户更好地了解聊天机器人。

因此，system 和 assistant 这两个类别的聊天消息在 OpenAI 聊天接口中扮演着非常重要的角色，它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。
