import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  categoryId?: number;

  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  businessId: number;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsOptional()
  currency?: string;

  @IsOptional()
  minQuantity?: number;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  isPriceAva?: boolean;
}
