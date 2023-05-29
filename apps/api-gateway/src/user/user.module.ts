/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-29 06:38:22
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';
import { GRPC_USER_V1_PACKAGE_NAME } from '@proto/gen/user.pb';
import { UserController } from './user.controller';
import { MICRO_PROTO_USER } from '@app/user-svc/constants';
import { join } from 'path';
@Module({
  controllers: [UserController],
  providers: [
    {
      provide: GRPC_USER_V1_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');

        return MicroConfig.microServerAddrUser.split(',').map((v) => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              url: v,
              package: GRPC_USER_V1_PACKAGE_NAME,
              protoPath: join(process.cwd(), MICRO_PROTO_USER),
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
export class UserModule {}
