/*
 * @Author: hsycc
 * @Date: 2023-05-11 05:19:17
 * @LastEditTime: 2023-05-11 18:59:41
 * @Description:
 *
 */
import { IsValidStruct } from '@lib/common';
import { ApiProperty } from '@nestjs/swagger';
import { ChatModel, StatusEnum, StructItem } from '@proto/gen/ai.pb';
import { Validate } from 'class-validator';
export class ChatModelEntity implements ChatModel {
  /** id */
  id: string;
  /** 服务提供商 */
  provider: string;
  /** 基础模型 */
  model: string;
  /** 会话模型名称 */
  name: string;

  @ApiProperty({
    type: 'array',
    items: {
      properties: {
        key: { type: 'string' },
        value: { type: 'string' },
      },
    },
    example: [
      { key: 'system', value: '请用中文和我讲话' },
      { key: 'assistant', value: '你是一只猫~' },
    ],
  })
  @Validate(IsValidStruct) // 约束 struct 结构
  struct: StructItem[];

  /** 预设问题模板 */
  questionTpl: string;
  /** 状态 */
  status: StatusEnum;
  /** 关联的渠道用户id */
  userId: string;
  /** 创建时间 */
  createdAt: number;
  /** 修改时间 */
  updatedAt: number;
}
