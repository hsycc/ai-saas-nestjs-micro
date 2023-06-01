/*
 * @Author: hsycc
 * @Date: 2023-05-29 08:03:58
 * @LastEditTime: 2023-06-04 23:36:54
 * @Description:
 *
 */
import { ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GRPCHealthIndicator, HealthCheckService } from '@nestjs/terminus';
import { GrpcOptions } from '@nestjs/microservices';
import { MICRO_SERVER_NAME_AI } from '@app/ai-svc/constants';
import { MICRO_SERVER_NAME_USER } from '@app/user-svc/constants';
import { MicroConfigType } from '@lib/config';
@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private grpc: GRPCHealthIndicator,
    private config: ConfigService,
    @Inject(Logger)
    logger: Logger,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // 强迫症, 替换为 nest Logger replace NestWinston
    health.logger = logger;
  }

  checkDb() {}

  async check() {
    const MicroConfig = this.config.get<MicroConfigType>('MicroConfig');

    try {
      return await this.health.check([
        ...MicroConfig.microServerAddrAi.split(',').map((v) => {
          return async () =>
            this.grpc.checkService<GrpcOptions>(
              MICRO_SERVER_NAME_AI + '-' + v,
              'health', // 占位字段
              {
                url: v,
                timeout: 1000,
              },
            );
        }),

        ...MicroConfig.microServerAddrUser.split(',').map((v) => {
          return async () =>
            this.grpc.checkService<GrpcOptions>(
              MICRO_SERVER_NAME_USER + '-' + v,
              'health', // 占位字段
              {
                url: v,
                timeout: 1000,
              },
            );
        }),
      ]);
    } catch (error) {
      return error.response;
    }
  }
}
