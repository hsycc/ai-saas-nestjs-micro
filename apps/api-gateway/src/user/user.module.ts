import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { USER_SERVICE_NAME, USER_PACKAGE_NAME } from '@proto/gen/user.pb';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: USER_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('MicroConfig.microUserDomain') +
              ':' +
              config.get<string>('MicroConfig.microUserPort'),
            package: USER_PACKAGE_NAME,
            protoPath: config.get<string>('MicroConfig.microUserProto'),
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
