
# Install pnpm 
# FROM node:16 AS base
FROM node:16-alpine AS base 
RUN npm install -g pnpm


# Install app dependencies
FROM base AS dependencies
WORKDIR /app
COPY package*.json  pnpm-lock.yaml ./
RUN pnpm install

# proto
COPY _proto/*.proto ./_proto/
# RUN make proto-all

# prisma
COPY prisma ./prisma/
RUN npx prisma generate --schema=prisma/user.prisma
RUN npx prisma generate --schema=prisma/gpt.prisma

# Build
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm run build api-gateway
RUN pnpm run build user-svc

# 移除不需要的packages。
RUN pnpm prune --prod


FROM base as deploy

WORKDIR /app

COPY --from=build /app/_proto ./_proto
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

# COPY --from=build /aap/.env ./


# 创建log的目录卷
EXPOSE 9000 50051-50061

# CMD ["node", "dist/apps/api-gateway/main"]
# CMD node ./dist/apps/api-gateway/main 
# CMD node ./dist/apps/user-svc/main 

