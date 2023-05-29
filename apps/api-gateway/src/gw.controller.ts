/*
 * @Author: hsycc
 * @Date: 2023-05-09 04:02:37
 * @LastEditTime: 2023-05-29 07:16:12
 * @Description:
 *
 */
import { Controller } from '@nestjs/common';
import { GwService } from './gw.service';

@Controller()
export class GwController {
  constructor(private readonly gwService: GwService) {}
}
