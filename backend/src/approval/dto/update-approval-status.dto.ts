import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';

export class UpdateApprovalStatusDto {
  @IsString()
  prNumber: string;

  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  itemIds?: number[];

  @IsOptional()
  @IsString()
  comments?: string;
}
