import {
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateOrderItemDto {
  @IsOptional()
  @IsInt()
  id?: number; // null → create new item

  @IsOptional()
  @IsString()
  prNumber?: string;

  @IsOptional()
  @IsInt()
  bpId?: number;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  status?: string; // PENDING | SHIPPED | DELIVERED | CANCELLED
}

export class UpdateOrderDto {
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsDateString()
  expectedDeliveryDate?: string;

  @IsOptional()
  @IsString()
  invoicelink?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];
}
