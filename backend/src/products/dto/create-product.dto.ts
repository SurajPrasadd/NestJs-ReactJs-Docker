import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  businessId: number;

  @IsOptional()
  categoryId?: number;

  @IsString()
  name: string;

  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  currency?: string;

  @IsOptional()
  minQuantity?: number;

  @IsOptional()
  isActive?: boolean;
}
