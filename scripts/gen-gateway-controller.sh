#!/bin/bash

###
 # @Author: hsycc
 # @Date: 2023-05-11 00:11:14
 # @LastEditTime: 2023-06-02 07:19:57
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

echo "import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  ApiBaseResponse,
  ApiListResponse,
  ApiObjResponse,
  BaseApiExtraModels,
} from '@lib/swagger';
import { Metadata } from '@grpc/grpc-js';
import { GenerateClsMetadata } from '../auth/decorators/cls-metadata.decorator';

import { 
  $(echo "$module" | tr '[:lower:]' '[:upper:]')_SERVICE_NAME,
  GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME,
  $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient,
} from '@proto/gen/$module.pb';

@ApiTags('$module')
@Controller('$module')
@BaseApiExtraModels()
export class $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Controller {
  constructor(
    @Inject(GRPC_$(echo "$module" | tr '[:lower:]' '[:upper:]')_V1_PACKAGE_NAME)
    private readonly clients: ClientGrpc[],
  ) {}

  get ${module}ServiceClient(): $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient {
    if (this.clients.length === 0) {
      throw new ServiceUnavailableException();
    }
    // 软负载均衡
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex].getService<$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient>(
      $(echo "$module" | tr '[:lower:]' '[:upper:]')_SERVICE_NAME,
    );
  }

  /**
   * 测试接口
   */
  @Get()
  test(
    @GenerateClsMetadata() generateClsMetadata,
  ) {
    return this.${module}ServiceClient.test({}, generateClsMetadata)
  }
}" > $work_dir/apps/api-gateway/src/$module/$module.controller.ts