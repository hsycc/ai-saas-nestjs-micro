<!--
 * @Author: hsycc
 * @Date: 2023-04-19 12:43:27
 * @LastEditTime: 2023-05-09 05:48:36
 * @Description:
 *
-->

## ai-saas-nestjs-micro

###

- [x] nest-cli monorepo mode create service and library

  ```
  nest g app user-svc
  nest g library common
  // todo: 单独构建 library  "build": "tsup index.ts --format cjs,esm --dts",
  ```

- [x] 动态配置管理

- [x] 注册 gRPC 微服务
- [x] gRPC 动态配置
- [x] protoc 编译 pb 文件以及 docs

  ```
    make proto-all
    make proto-user
    make ...

    bash script/generate-proto-docs.sh

  ```

- [x] swagger;

- libs 服务公共依赖库的管理

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

- [x] 切换成 prisma/ postgresql
- [ ] docker
  - [x] dockerfile
  - [x] docker-compose
  - [ ] docker Swarm 集群部署
- [x] jwt
  - TODO: 安全拓展
  - [ ] accessToken & refresh 刷新
  - [ ] logout redis remove jwt sign
  - [ ] 接入 sms 短信 以及验证码服务
- [x] 渠道用户登录鉴权
- [ ] api 调用鉴权 逻辑

- [ ] 网关监控 健康检查 熔断限流
- [ ] 权限设计
- [ ] 缓存
- [ ] 幂等设计
- [ ] 日志管理
- [ ] 链路追踪
- [ ] 配置中心 nacos

## 业务设计

- [ ] 渠道用户管理
- [ ] gpt 会话模型管理

- [ ] 账号体系
- [ ] chat-gpt 服务设计

## 备忘

- 鉴权逻辑均放在 api-gateway/auth 模块当中
- [ ]设计 ak、sk 签名流程
- [ ]ak/sk 自定义 Passport 插件编码 ApiStrategy
- [ ]改写 rpcExceptions 的抛出逻辑
