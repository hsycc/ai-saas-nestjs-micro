# Install pnpm 
FROM node:16-alpine AS base 
RUN npm install -g pnpm

# Install app dependencies
FROM base AS dependencies
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install --silent

# proto and prisma
COPY _proto prisma ./ 
RUN npx prisma generate --schema=prisma/user.prisma && \
    npx prisma generate --schema=prisma/ai.prisma

# Build
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm run build api-gateway && \
    pnpm run build user-svc && \
    pnpm run build ai-svc && \
    pnpm prune --prod

FROM base AS deploy
WORKDIR /app
COPY --from=build /app/_proto ./_proto
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 9000 50051-50061


# CMD ["node", "dist/apps/api-gateway/main"]
# CMD node ./dist/apps/api-gateway/main 
# CMD node ./dist/apps/user-svc/main 
# CMD node ./dist/apps/ai-svc/main 