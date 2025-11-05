// dto/update-approval-status.dto.ts
import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class UpdateApprovalStatusDto {
  @IsArray()
  @ArrayNotEmpty()
  approvalIds: number[];

  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  comments?: string;
}
