/*
 * @Author: hsycc
 * @Date: 2023-05-11 14:17:15
 * @LastEditTime: 2023-05-16 20:03:30
 * @Description:
 *
 */
import { ChatModelStructItem } from '@proto/gen/ai.pb';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ChatCompletionRequestMessageRoleEnum } from 'openai';

@ValidatorConstraint({ name: 'IsValidChatModelStruct', async: false })
export class IsValidChatModelStruct implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: ChatModelStructItem, args: ValidationArguments) {
    if (value === null) {
      return true;
    }

    if (Array.isArray(value)) {
      // 验证数组中每个元素的格式
      return value.every((item) => {
        return (
          typeof item === 'object' &&
          Object.values(ChatCompletionRequestMessageRoleEnum).includes(
            item.key,
          ) &&
          typeof item.key === 'string' &&
          item.value &&
          typeof item.value === 'string'
        );
      });
    }

    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(args: ValidationArguments) {
    return 'Invalid ChatModelStruct';
  }
}
