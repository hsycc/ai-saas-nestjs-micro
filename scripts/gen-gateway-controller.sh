
###
 # @Author: hsycc
 # @Date: 2023-05-11 00:11:14
 # @LastEditTime: 2023-05-25 17:18:16
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

echo "import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  OnModuleInit,
  Inject,
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

import {} from '../auth/guard';

import { $(echo "$module" | tr '[:lower:]' '[:upper:]')_SERVICE_NAME, $(echo "$module" | tr '[:lower:]' '[:upper:]')_PACKAGE_NAME, $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient } from '@proto/gen/$module.pb';
// import {} from '@app/svc//dto';
// import {} from '@app/svc/entities/.entity

@ApiTags('$module')
@Controller('$module')
@BaseApiExtraModels()
export class $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')Controller implements OnModuleInit {
  private ${module}ServiceClient: $(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient;

  constructor(
    @Inject($(echo "$module" | tr '[:lower:]' '[:upper:]')_PACKAGE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  public onModuleInit(): void {
    this.${module}ServiceClient =
      this.client.getService<$(echo "$module" | awk '{print toupper(substr($0, 1, 1)) substr($0, 2)}')ServiceClient>($(echo "$module" | tr '[:lower:]' '[:upper:]')_SERVICE_NAME);
  }

  /**
   * 测试接口
   */
  @Get()
  test() {
    return this.${module}ServiceClient.test({}, new Metadata())
  }
}" > $work_dir/apps/api-gateway/src/$module/$module.controller.ts