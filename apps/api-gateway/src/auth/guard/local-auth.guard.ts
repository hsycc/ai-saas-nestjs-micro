/*
 * @Author: hsycc
 * @Date: 2023-05-08 06:16:06
 * @LastEditTime: 2023-05-08 21:25:11
 * @Description: 封装AuthGuard,方便维护
 *
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
