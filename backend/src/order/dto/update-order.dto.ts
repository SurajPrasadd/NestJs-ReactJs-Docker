import { IsOptional, IsString, IsIn, IsDateString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsIn(['PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: Date;
}
