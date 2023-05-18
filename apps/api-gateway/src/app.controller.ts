/*
 * @Author: hsycc
 * @Date: 2023-05-09 04:02:37
 * @LastEditTime: 2023-05-18 13:48:41
 * @Description:
 *
 */
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
