<!--
 * @Author: hsycc
 * @Date: 2023-05-04 14:59:03
 * @LastEditTime: 2023-05-06 06:52:29
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

## 使用多个 prisma 客户端管理

```bash
# init
npx prisma init

# generate client
npx prisma generate --schema=prisma/user.prisma
npx prisma generate --schema=prisma/gpt.prisma

# 生成 sql 迁移命令 migrate
# dev reset deploy status resolve diff
npx prisma migrate dev -n user --schema=prisma/user.prisma
npx prisma migrate dev -n gpt --schema=prisma/gpt.prisma

npx prisma migrate deploy --schema=prisma/user.prisma
npx prisma migrate deploy --schema=prisma/gpt.prisma

# studio
npx prisma studio --schema=prisma/user.prisma -p 5555
npx prisma studio --schema=prisma/gpt.prisma -p 5556

# db [pull push seed execute]
# 根据 migrations 文件 创建 db
npx prisma push --schema=prisma/user.prisma
npx prisma push --schema=prisma/gpt.prisma
```

## TODO

- [ ] prisma migrate 多个 client 命令行管理
- [ ] [使用 multiSchema](https://www.prisma.io/docs/guides/other/multi-schema#learn-more-about-the-multischema-preview-feature)
