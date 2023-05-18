/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:09
 * @LastEditTime: 2023-05-18 13:51:27
 * @Description:
 *
 */
import { registerAs } from '@nestjs/config';

export const AiConfig = registerAs('AiConfig', () => ({
  apiKey: process.env.GPT_API_KEY,
}));
