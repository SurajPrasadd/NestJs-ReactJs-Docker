import { IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';

export class QueryPurchaseRequestDto {
  @IsOptional()
  @IsString()
  search?: string; // can match prNumber or remarks

  @IsOptional()
  @IsInt()
  requestedBy?: number;

  @IsOptional()
  @IsInt()
  businessId?: number;

  @IsOptional()
  @IsString()
  status?: string; // e.g. PENDING, APPROVED, REJECTED

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  page = 1;

  @IsOptional()
  @IsInt()
  limit = 10;

  @IsOptional()
  @IsString()
  sortBy = 'createdAt';

  @IsOptional()
  @IsString()
  order: 'ASC' | 'DESC' = 'DESC';
}
