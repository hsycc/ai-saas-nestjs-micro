##  Install pnpm and app dependencies
FROM node:16-alpine as base

RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

COPY .env* ./

COPY _proto/*.proto ./_proto/

COPY prisma/*.prisma ./prisma/


RUN pnpm config set registry https://registry.npmmirror.com

RUN pnpm install --prod --frozen-lockfile
# --silent

## Generate proto and prisma files
RUN pnpm run prisma:generate


## install grpc_health_probe
RUN wget -qO /usr/local/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/latest/download/grpc_health_probe-linux-amd64 \
    && chmod +x /usr/local/bin/grpc_health_probe


##  TODO： 同步数据库  


##  Build the app
FROM base AS build

COPY . ./

RUN pnpm run build api-gateway && \
    pnpm run build user-svc && \
    pnpm run build ai-svc 

## Final deployment 
FROM base AS deploy

COPY --from=build /app/dist ./dist

EXPOSE 9000 50051-50061 5432

