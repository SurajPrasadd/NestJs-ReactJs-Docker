import { IsOptional, IsInt, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryApprovalDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  purchaseRequestId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  approvedBy?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  approvalLevel?: number;

  @IsOptional()
  @IsString()
  status?: string; // PENDING | APPROVED | REJECTED

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit = 10;

  @IsOptional()
  @IsString()
  sortBy = 'createdAt';

  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC' = 'DESC';
}
