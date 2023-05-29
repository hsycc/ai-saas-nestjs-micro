/*
 * @Author: hsycc
 * @Date: 2023-05-29 07:20:33
 * @LastEditTime: 2023-05-29 22:05:24
 * @Description:
 *
 */
import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  /**
   * grpc 服务实例的健康检查
   */
  @Get()
  @HealthCheck()
  check() {
    return this.healthService.check();
  }
}
