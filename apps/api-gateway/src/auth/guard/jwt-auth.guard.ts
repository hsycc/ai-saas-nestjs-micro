/*
 * @Author: hsycc
 * @Date: 2023-05-08 06:16:06
 * @LastEditTime: 2023-05-08 06:17:06
 * @Description:
 *
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
