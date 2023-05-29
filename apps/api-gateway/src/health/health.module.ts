/*
 * @Author: hsycc
 * @Date: 2023-05-29 21:07:13
 * @LastEditTime: 2023-05-29 21:52:24
 * @Description:
 *
 */
import { Module } from '@nestjs/common';

import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

import { HealthService } from './health.service';
import { HealthController } from './health.controller';
@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
