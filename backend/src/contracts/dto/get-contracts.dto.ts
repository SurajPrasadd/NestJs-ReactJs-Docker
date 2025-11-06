import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
  IsIn,
  Min,
} from 'class-validator';

export class GetContractsDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number; // buyer_id

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  businessId?: number; // business_id

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string; // search text

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'price', 'startDate', 'endDate'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder: string = 'DESC';
}
