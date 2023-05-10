import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
}

export class ResponseObjDto<TData> extends ResponseDto {
  @ApiProperty()
  data: TData;
}
export class ResponseListDataDto<TData> {
  @ApiProperty()
  results: TData[];
}
export class ResponseListDto<TData> extends ResponseDto {
  @ApiProperty()
  data: ResponseListDataDto<TData>;
}

export class ResPaginatedDto {
  @ApiProperty()
  current: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  total: number;
}

export class ResponsePaginatedDataDto<TData> {
  @ApiProperty()
  results: TData[];

  @ApiProperty()
  pagination: ResPaginatedDto;
}

export class ResponsePaginatedDto<TData> extends ResponseDto {
  @ApiProperty()
  data: ResponsePaginatedDataDto<TData>;
}
