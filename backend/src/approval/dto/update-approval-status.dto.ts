import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class UpdateApprovalStatusDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  approvalIds?: number[];

  @IsOptional()
  @IsString()
  comments?: string;
}
