import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetApprovalsQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // search by PR number or remarks

  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'PARTIALLY_APPROVED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PARTIALLY_APPROVED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  approvedBy?: number; // optional filter by user

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'status' | 'approvalLevel';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
