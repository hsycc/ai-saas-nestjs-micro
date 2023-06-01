/*
 * @Author: hsycc
 * @Date: 2023-05-29 21:07:13
 * @LastEditTime: 2023-06-02 03:26:10
 * @Description:
 *
 */
import { Logger, Module } from '@nestjs/common';

import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthService } from './health.service';
import { HealthController } from './health.controller';
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService, Logger],
})
export class HealthModule {}
