/*
 * @Author: hsycc
 * @Date: 2023-05-15 12:58:48
 * @LastEditTime: 2023-05-15 13:12:53
 * @Description:
 *
 */

import { ChatCompletionRequestMessage } from 'openai';
export class ChatDto {
  /**
   *  会话模型id, 为空调用 openai chat/completion 不设置 默认角色地定义
   *
   * */
  public chaModelId?: string;
  /** 提问的问题文本 */
  public question: string;

  public messages: ChatCompletionRequestMessage[];
}
