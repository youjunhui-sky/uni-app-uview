import { IsOptional, IsNumberString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PageDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 10;
}

export class PageResponse<T> {
  list: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}
