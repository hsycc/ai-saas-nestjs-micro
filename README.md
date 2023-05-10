<!--
 * @Author: hsycc
 * @Date: 2023-04-19 12:43:27
 * @LastEditTime: 2023-05-10 08:20:22
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
- [ ] ak/sk 自定义 Passport 插件编码 ApiStrategy
- [ ] 改写 rpcExceptions 的抛出逻辑
- [ ] proto return google.protobuf.Empty 的
- [ ] proto prisma 分页查询处理
- [ ] postresql 默认显示的时区问题, 设置为 utc-8
- [ ] https://github.com/prisma/prisma/issues/5051 prisma 是有记录偏移量
