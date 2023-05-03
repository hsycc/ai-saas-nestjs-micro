import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

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
  })
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 50;
  })
  @IsNumber()
  public pageSize?: number;

  @ApiProperty({
    description: '当前页码',
    example: 1,
  })
  @Transform(({ value }) => {
    return value && !isNaN(value) ? parseInt(value, 10) : 1;
  })
  @IsNumber()
  public current?: number;
}
