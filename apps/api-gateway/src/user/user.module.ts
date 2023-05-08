/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:03:20
 * @LastEditTime: 2023-05-08 05:04:44
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MicroConfigType } from '@app/config';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '@proto/gen/user.pb';
import { UserService } from './user.service';
import { UserController } from './user.controller';
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: USER_SERVICE_NAME,
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
  exports: [UserService],
})
export class UserModule {}
