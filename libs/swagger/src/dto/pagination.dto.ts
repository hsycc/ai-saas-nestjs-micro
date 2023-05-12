/*
 * @Author: hsycc
 * @Date: 2023-05-09 03:52:09
 * @LastEditTime: 2023-05-11 18:20:01
 * @Description:
 *
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// 一个比较完整的 swagger 用例
// https://stackoverflow.com/questions/59600411/does-nestjs-swagger-support-documentation-of-query-params-if-they-are-not-used

export class PaginatedDto {
  constructor() {
    this.pageSize = 50;
    this.current = 1;
  }

  @ApiProperty({
    description: '分页长度',
    example: 50,
    default: 50,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public pageSize?: number;
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 50;
  })
  @ApiProperty({
    description: '当前页码',
    example: 1,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 1;
  })
  public current?: number;
}
