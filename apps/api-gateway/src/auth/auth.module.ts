/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-08 11:13:16
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigType, MicroConfigType } from '@app/config';
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '@proto/gen/user.pb';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { ApiStrategy } from './strategy/api.strategy';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const JwtConfig = config.get<JwtConfigType>('JwtConfig');
        return {
          secret: JwtConfig.accessSecretKey,
          signOptions: { expiresIn: JwtConfig.expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
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
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // ApiStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
