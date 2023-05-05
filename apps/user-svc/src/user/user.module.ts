/*
 * @Author: hsycc
 * @Date: 2023-04-19 15:08:01
 * @LastEditTime: 2023-05-05 23:35:26
 * @Description:
 *
 */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from './jwt.service';

import { JwtConfigType } from '@app/config';

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
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
