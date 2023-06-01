#!/bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 00:59:54
 # @LastEditTime: 2023-06-01 08:29:34
 # @Description: 
 # 
### 

#!/bin/bash
current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1


echo "generator client {
  provider = \"prisma-client-js\"
  output   = \"../prisma/@$module-client\"
}

datasource db {
  provider = \"postgresql\"
  url      = env(\"PG_DATABASE_$(echo "$module" | tr '[:lower:]' '[:upper:]')\")
}

model $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Model {
  id String @id @default(cuid())

  @@map(\"${module}_model\")
}" > ./prisma/$module.prisma
