/*
 * @Author: hsycc
 * @Date: 2023-05-08 04:23:31
 * @LastEditTime: 2023-05-30 13:46:38
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigType, MicroConfigType } from '@lib/config';
import { GRPC_USER_V1_PACKAGE_NAME } from '@proto/gen/user.pb';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AkSkStrategy } from './strategy/ak-sk.strategy';
import { join } from 'path';
import { MICRO_PROTO_USER } from '@app/user-svc/constants';
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
      provide: GRPC_USER_V1_PACKAGE_NAME,
      useFactory: (config: ConfigService) => {
        const MicroConfig = config.get<MicroConfigType>('MicroConfig');

        return MicroConfig.microServerAddrUser.split(',').map((v) => {
          return ClientProxyFactory.create({
            transport: Transport.GRPC,
            options: {
              url: v,
              package: [GRPC_USER_V1_PACKAGE_NAME],
              protoPath: [join(process.cwd(), MICRO_PROTO_USER)],
              loader: {
                keepCase: true,
              },
            },
          });
        });
      },
      inject: [ConfigService],
    },
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AkSkStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
