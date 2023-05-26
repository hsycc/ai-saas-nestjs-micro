###
 # @Author: hsycc
 # @Date: 2023-05-11 00:11:12
 # @LastEditTime: 2023-05-25 17:04:41
 # @Description: 
 # 
### 

#!/bin/bash
current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


#!/bin/bash
if [ -z "$1" ]; then
  echo "Missing moudule name"
  exit 1
fi

module=$1

echo "import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';

import { $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Controller } from './$module.controller';
import { $(echo "$module" | tr '[:lower:]' '[:upper:]')_PACKAGE_NAME } from '@proto/gen/$module.pb';

@Module({
  controllers: [$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Controller],
  providers: [
    {
      provide: $(echo "$module" | tr '[:lower:]' '[:upper:]')_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: MicroConfig.microDomain$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}') + ':' + MicroConfig.microPort$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}'),
            package: $(echo "$module" | tr '[:lower:]' '[:upper:]')_PACKAGE_NAME,
            protoPath: MicroConfig.microProto$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Module {}" > $work_dir/apps/api-gateway/src/$module/$module.module.ts