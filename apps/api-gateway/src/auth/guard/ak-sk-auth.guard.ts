/*
 * @Author: hsycc
 * @Date: 2023-05-08 06:16:06
 * @LastEditTime: 2023-05-11 08:07:34
 * @Description: 封装AuthGuard,方便维护
 *
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AkSkAuthGuard extends AuthGuard('ak/sk') {}
