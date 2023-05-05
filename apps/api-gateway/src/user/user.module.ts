import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '@proto/gen/user.pb';
import { UserService } from './user.service';
import { MicroConfigType } from '@app/config';

@Global()
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
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
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
