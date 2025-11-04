import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class AddToCartDto {
  @IsNotEmpty()
  @IsInt()
  bpId: number;

  @IsOptional()
  @IsInt()
  quantity?: number = 1;
}
