import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 根据档案号查询 SWL 诊疗记录列表 DTO
 */
export class GetSwlByPatientNoDto {
  @IsString()
  @IsNotEmpty({ message: '档案号不能为空' })
  patientNo: string;
}
