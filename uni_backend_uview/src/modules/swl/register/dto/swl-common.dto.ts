import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 根据碎石号查询（通用 DTO）
 */
export class FindBySwlNoDto {
  @IsString()
  @IsNotEmpty({ message: '碎石号不能为空' })
  swlNo: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  episode?: string;
}
