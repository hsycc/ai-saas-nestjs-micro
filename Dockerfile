FROM node:16-alpine as build
WORKDIR /app
COPY package*.json .
COPY pnpm-lock.yaml .
RUN pnpm install 
COPY . .
RUN npm run build

FROM node:16-alpine as base
WORKDIR /app
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install --lockfile-only
COPY --from=build /app/dist /app/dist
CMD ["node", "dist/apps/api-gateway/main"]