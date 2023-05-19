<!--
 * @Author: hsycc
 * @Date: 2023-04-19 12:43:27
 * @LastEditTime: 2023-05-19 11:03:51
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
- [其他文档]('./docs')

## 环境依赖

- git
- pnpm 8.5.1
- node 16.19.1
- docker 20.10.7
- docker-compose 1.29.2
- postgresql 13.5

## 架构设计

- [x] 基础框架 nestJs (monorepo 模式)
- [x] 动态配置管理
- [x] gRPC 动态配置以及注册调用
- [x] proto 编译管理以及文档生成
- [x] prisma 数据库查询器
- [x] swagger
- [x] docker (配置脚本待优化, 管理 postgresql/redis, 微服务)
  - [x] dockerfile
  - [x] docker-compose
  - [ ] docker Swarm 集群部署
- [x] jwt 登录
  - 安全拓展待完善
    - [ ] accessToken & refresh 刷新
    - [ ] 登出 logout redis remove jwt sign
- [x] [鉴权设计](./apps/api-gateway/src/auth/)
  - [x] local 本地化策略(登录策略)
  - [x] jwt 登录鉴权
  - [x] ak/ks ai 调用鉴权
- [ ] 新服务以及新模块的快速快发
  - [x] [shell 脚本编码 ]('./scripts/develop-cli.md')
  - [ ] cli-配置化（待完成）
- [ ] 权限设计
- [ ] 网关监控 健康检查 熔断限流
- [ ] 接口调用的幂等设计
- [ ] 缓存
- [ ] 日志管理
- [ ] 链路追踪 (skywalking or other)
- [ ] 配置中心 (nacos or other)
- [ ] 运维以及容灾设
  - [x] shell 脚本，pm2 管理 (后面切换 docker 管理)

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
    - [ ] /ai/invoke/stt 语音转文字

## 如何运行(开发环境)

```bash

# 编辑配置文件
mv .env.example .env
vim .env

# docker 启动 postgresql (如果开发环境没有安装启动 postgresql )
# 等价于  "docker-compose -f docker-compose.db.yml up -d",
pnpm run docker:db

pnpm install

pnpm run start api-gateway

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
      │ └── open-ai                   open-ai(chat-gpt) 的能力封装

```

## 备忘

- 鉴权设计

  - 鉴权逻辑均放在 api-gateway/auth 模块当中, 数据结构验证也放在 网关服务处理
  - [x] 设计 ak、sk 签名流程 （参考 [百度云市场](https://cloud.baidu.com/doc/Reference/s/Njwvz1wot)）
  - [x] ak/sk 自定义 Passport 插件编码 AkSkStrategy

- rpc Exceptions 优化

  - [ ] rpcExceptions 异常枚举值定义 抛出逻辑
  - [ ] rpc 服务挂掉的异常捕获
  - [ ] rpc 序列化 JSON.parse 的异常捕获

- prisma

  - [ ] prisma 中间件 （logger 异常抛出, findFirstOrThrow ）
  - [ ] prisma 软删除设计
  - [ ] prisma model 硬编码 成 proto3 的 message 脚本
  - [ ] 研究下 postgresql 默认显示的时区问题, 设置为 utc-8, prisma 存储的日期格式是有记录时区偏移量[https://github.com/prisma/prisma/issues/5051]

- proto
  - [ ] proto 定义的字段为数组且值为空， 反序列化时 该字段会丢失，研究下怎么解决

## openai

chat/completions

system 类的聊天消息通常是指代当前聊天会话的全局信息，例如聊天会话的 ID、当前的时间戳、当前的聊天主题等。这些信息对于聊天机器人来说非常重要，因为它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。

另一方面，assistant 类的聊天消息通常是指代聊天机器人自身的信息，例如聊天机器人的名称、聊天机器人的介绍、聊天机器人的提示等。这些信息通常是由聊天机器人自己发出的，用于与用户进行互动，并帮助用户更好地了解聊天机器人。

因此，system 和 assistant 这两个类别的聊天消息在 OpenAI 聊天接口中扮演着非常重要的角色，它们可以帮助聊天机器人更好地理解当前聊天上下文，从而生成更准确的自动补全建议。
