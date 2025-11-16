import { IsOptional, IsString, IsIn, IsInt } from 'class-validator';

export class GetApprovalsQueryDto {
  @IsOptional()
  @IsString()
  search?: string; // search by PR number or remarks

  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsInt()
  approvedBy?: number; // optional filter by user

  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'status' | 'approvalLevel';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsInt()
  limit?: number = 10;
}
