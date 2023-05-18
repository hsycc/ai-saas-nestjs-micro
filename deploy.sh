
###
 # @Author: hsycc
 # @Date: 2023-05-09 03:52:09
 # @LastEditTime: 2023-05-19 10:01:30
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

pnpm run prisma:push


pm2 reload process.json 

pnpm run seed

exit 0;


