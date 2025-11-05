import { IsOptional, IsInt, IsBoolean, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPurchaseRequestDto {
  @IsOptional()
  @IsString()
  search?: string; // can match prNumber or remarks

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  requestedBy?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  businessId?: number;

  @IsOptional()
  @IsString()
  status?: string; // e.g. PENDING, APPROVED, REJECTED

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
