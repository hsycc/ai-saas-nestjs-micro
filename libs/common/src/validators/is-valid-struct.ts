/*
 * @Author: hsycc
 * @Date: 2023-05-11 14:17:15
 * @LastEditTime: 2023-05-11 14:27:34
 * @Description:
 *
 */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidStruct', async: false })
export class IsValidStruct implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (value === null) {
      return true;
    }

    if (Array.isArray(value)) {
      // 验证数组中每个元素的格式
      return value.every((item) => {
        return (
          typeof item === 'object' &&
          item.key !== undefined &&
          typeof item.key === 'string' &&
          item.value !== undefined &&
          typeof item.value === 'string'
        );
      });
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'The struct field must be null, an empty array, or an array with elements structured with a key and value field.';
  }
}
