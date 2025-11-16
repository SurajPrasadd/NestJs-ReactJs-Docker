import { IsInt, IsOptional, IsString, IsIn, Min } from 'class-validator';

export class GetOrdersDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  businessId?: number;

  @IsOptional()
  @IsString()
  search?: string;

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
  @IsIn(['createdAt', 'orderNumber', 'totalAmount', 'status'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC', 'asc', 'desc'])
  sortOrder: string = 'DESC';
}
