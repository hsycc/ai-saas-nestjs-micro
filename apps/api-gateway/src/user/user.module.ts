/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-24 19:48:44
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@lib/config';
import { USER_PACKAGE_NAME } from '@proto/gen/user.pb';
import { UserController } from './user.controller';
@Module({
  controllers: [UserController],
  providers: [
    {
      provide: USER_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: `${MicroConfig.microDomainUser}:${MicroConfig.microPortUser}`,
            package: USER_PACKAGE_NAME,
            protoPath: MicroConfig.microProtoUser,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class UserModule {}
