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
  userId?: number; // buyer_id

  @IsOptional()
  @IsInt()
  businessId?: number; // business_id

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string; // search text

  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsInt()
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
