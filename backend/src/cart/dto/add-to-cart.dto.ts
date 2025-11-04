import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsOptional()
  @IsInt()
  quantity?: number = 1;
}
