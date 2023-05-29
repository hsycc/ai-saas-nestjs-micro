
###
 # @Author: hsycc
 # @Date: 2023-05-11 00:11:14
 # @LastEditTime: 2023-05-30 00:13:18
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
  test() {
    return this.${module}ServiceClient.test({}, new Metadata())
  }
}" > $work_dir/apps/api-gateway/src/$module/$module.controller.ts