## ai-saas-nestjs

### TODO

- [x] 顶层 package.json 管理 , 使用 nest-cli monorepo mode 管理 service and library

  ```
  nest g app auth-svc
  nest g library common // todo: 单独构建 library  "build": "tsup index.ts --format cjs,esm --dts",
  ```

- [x] 动态配置管理
- [x] gRPC 配置
- [x] protoc 编译 pb 文件以及 docs

  ```
    make proto-all
    make proto-auth
    make ...

    bash script/generate-proto-docs.sh

  ```

- [x] request 挂载

  ```
    @Inject(REQUEST)
      private readonly request: Request & {
        _chainId: string;
        _privateKeyHash: string;
        _rpcURL: string;
        _mongoURL: string;
    },
  ```

- [ ]全局异常过滤器
- [ ] 全局响应体结构封装
- [ ] jwt

- dto 数据结构体验证
  - proto gen interface to 类型检查
  - apiBody dto
  - apiResponse
- [ ] swagger;

- [ ] 日志管理

- [ ] 登录鉴权
- [ ] 权限设计

- [ ] 缓存

- [ ] 切换成 prisma/ pg

- [ ] 网关监控 健康检查 熔断限流
- [ ] 链路追踪
- [ ] 配置中心 nacos
- [ ] docker 集群部署

## 业务设计

- [ ] 账号体系
- [ ] 渠道管理
- [ ] chat-gtp 服务设计
-
