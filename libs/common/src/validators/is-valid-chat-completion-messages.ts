/*
 * @Author: hsycc
 * @Date: 2023-05-11 14:17:15
 * @LastEditTime: 2023-05-16 20:02:05
 * @Description:
 *
 */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';

@ValidatorConstraint({ name: 'IsValidChatCompletionMessages', async: false })
export class IsValidChatCompletionMessages
  implements ValidatorConstraintInterface
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: ChatCompletionRequestMessage[], args: ValidationArguments) {
    if (value === null) {
      return true;
    }

    if (Array.isArray(value)) {
      // 验证数组中每个元素的格式
      return value.every((item: ChatCompletionRequestMessage) => {
        return (
          typeof item === 'object' &&
          Object.values(ChatCompletionRequestMessageRoleEnum).includes(
            item.role,
          ) &&
          typeof item.content === 'string' &&
          item.content
        );
      });
    }

    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Invalid ChatCompletionMessages';
  }
}
