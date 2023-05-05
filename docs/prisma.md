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

## 使用多个 prisma 客户端管理

```bash
# init
npx prisma init

# 生成 client
npx prisma generate --schema=prisma/user.prisma
npx prisma generate --schema=prisma/gpt.prisma

# 生成 sql 迁移命令 migrate
# dev reset deploy status resolve diff
npx prisma migrate dev -n init --schema=prisma/user.prisma
npx prisma migrate dev -n init --schema=prisma/gpt.prisma

npx prisma migrate deploy --schema=prisma/user.prisma
npx prisma migrate deploy --schema=prisma/gpt.prisma

# studio
npx prisma studio --schema=prisma/user.prisma -p 5555
npx prisma studio --schema=prisma/gpt.prisma -p 5556

# db
# pull push seed execute
npx prisma pull --schema=prisma/user.prisma
npx prisma pull --schema=prisma/gpt.prisma
```

## nestjs
