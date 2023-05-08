/*
 * @Author: hsycc
 * @Date: 2023-05-08 06:16:06
 * @LastEditTime: 2023-05-08 06:16:23
 * @Description:
 *
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
