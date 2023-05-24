<!--
 * @Author: hsycc
 * @Date: 2023-05-04 14:59:03
 * @LastEditTime: 2023-05-24 15:27:30
 * @Description:
 *
-->

# prisma

Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
Prisma Studio: GUI to view and edit data in your database

## docs

- [官方文档](https://www.prisma.io/docs/getting-started)
- [命令清单](https://fig.io/manual/prisma)
- [playground]https://playground.prisma.io/
- [Building a REST API with NestJS and Prisma](https://www.prisma.io/blog/nestjs-prisma-rest-api-7D056s1BmOL0)
- [nestjs-prisma](https://nestjs-prisma.dev/docs/installation/)
- [Error message reference](https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine)

- [快速入手-面向 Node.js 和 TypeScript 的下一代 ORM 工具 Prisma](https://mdnice.com/writing/3ef20876125847e08e9e6977394fc2fe)

## 使用多个 prisma 客户端管理

```bash
# init
npx prisma init

# generate client
npx prisma generate --schema=prisma/user.prisma
npx prisma generate --schema=prisma/ai.prisma

# 生成 sql 迁移命令 migrate
## dev 开发环境 生成 migrations sql 命令 文件
## reset
## deploy 根据 migrations sql 命令 文件 同步数据库
## status
## resolve
## diff
npx prisma migrate dev -n user --schema=prisma/user.prisma
npx prisma migrate dev -n ai --schema=prisma/ai.prisma

npx prisma migrate deploy --schema=prisma/user.prisma
npx prisma migrate deploy --schema=prisma/ai.prisma

# studio
npx prisma studio --schema=prisma/user.prisma -p 5555
npx prisma studio --schema=prisma/ai.prisma -p 5556

# db
## push 同步远程数据库， 可能会造成数据丢失， 不与迁移交互或依赖迁移。不会更新迁移表，也不会生成迁移文件。 推荐用 prisma migrate deploy 同步数据库
## pull 远程数据库 同步生成 .prisma 文件
## seed  直接 用 pnpm run seed 替代， 推送数据
npx prisma db push --schema=prisma/user.prisma
npx prisma db push --schema=prisma/ai.prisma
```

## TODO

- [ ] prisma migrate 多个 client 命令行管理
- [ ] [使用 multiSchema](https://www.prisma.io/docs/guides/other/multi-schema#learn-more-about-the-multischema-preview-feature)
