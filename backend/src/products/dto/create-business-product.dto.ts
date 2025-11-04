import {
  IsNumber,
  IsBoolean,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateBusinessProductDto {
  @IsNumber()
  businessId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  minQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
