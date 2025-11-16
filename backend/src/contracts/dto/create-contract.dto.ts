import {
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ContractItemDto {
  @IsNotEmpty()
  itemId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateContractDto {
  @IsNotEmpty()
  prNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContractItemDto)
  items: ContractItemDto[];
}
