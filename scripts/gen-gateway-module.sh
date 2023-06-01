#!/bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 00:11:12
 # @LastEditTime: 2023-06-01 08:29:28
 # @Description: 
 # 
###
 
current_dir=$(dirname "$(readlink -f "$0")")

work_dir=$(dirname "$current_dir")


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
import { GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME } from '@proto/gen/$module.pb';
import { MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]') } from '@app/$module-svc/constants';
import { join } from 'path';

@Module({
  controllers: [$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Controller],
  providers: [
    {
      provide: GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');

        return MicroConfig.microServerAddr$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}').split(',').map((v) => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              url: v,
              package: GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME,
              protoPath: join(process.cwd(), MICRO_PROTO_$(echo "$module" | tr '[:lower:]' '[:upper:]')),
              loader: {
                keepCase: true,
              },
            },
          });
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Module {}" > $work_dir/apps/api-gateway/src/$module/$module.module.ts