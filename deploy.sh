
###
 # @Author: hsycc
 # @Date: 2023-05-09 03:52:09
 # @LastEditTime: 2023-05-24 23:09:48
 # @Description: 
 # 
### 
#!/bin/sh

set -e;

# export PATH=$PATH:/root/.nvm/versions/node/v16.19.1/bin;

if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

pnpm install --frozen-lockfile 

pnpm run build user-svc

pnpm run build ai-svc

pnpm run build api-gateway

pnpm run prisma:generate

# db push 可能造成 数据的丢失 , 用 migrate deploy 替代
# pnpm run prisma:push
# 预设数据
# pnpm run seed


# 根据生成的sql命令同步数据库
pnpm run prisma:deploy

pm2 reload process.json 

pnpm run seed

exit 0;


