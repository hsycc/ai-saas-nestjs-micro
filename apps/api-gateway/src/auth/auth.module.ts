import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE_NAME, AUTH_PACKAGE_NAME } from '@proto/gen/auth.pb';
import { AuthService } from './auth.service';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: AUTH_SERVICE_NAME,
      useFactory: (config: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url:
              config.get<string>('microConfig.microAuthDomain') +
              ':' +
              config.get<string>('microConfig.microAuthPort'),
            package: AUTH_PACKAGE_NAME,
            protoPath: config.get<string>('microConfig.microAuthProto'),
          },
        });
      },
      inject: [ConfigService],
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
