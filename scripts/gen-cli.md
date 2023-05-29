<!--
 * @Author: hsycc
 * @Date: 2023-05-10 22:49:02
 * @LastEditTime: 2023-05-29 07:09:54
 * @Description:
 *
-->

# nestjs-grpc-prisma 微服务架构 gen-cli 快速开发新服务的工具库

```bash

node scripts/gen-cli.js -h

# 创建一个完整的微服务，挂载网关服务
node scripts/gen-cli.js create -n name -p 50050 --db dbname

# 创建 proto 相关
node scripts/gen-cli.js gen-proto  -n name

# 创建 prisma 相关
node scripts/gen-cli.js gen-prisma -n name  --db dbname

# 创建 svc 服务运行所依赖的环境变量
node scripts/gen-cli.js gen-svc-env -n name -p 50050

# 只创建 grpc 微服务 svc
node scripts/gen-cli.js gen-svc -n name

# 在 api-gateway(网关服务) 挂载微服务 svc
node scripts/gen-cli.js  gen-gw  -n name

# 创建 grpc 微服务 svc 的 resource, 可以抽象封装下
nest g resource ${module} --project ${project}`

```

## TODO LIST

- prisma 预设 seed.ts
- proto 预设 message service 和 svc module 预设 service 方法
