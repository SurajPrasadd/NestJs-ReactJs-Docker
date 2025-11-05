import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateApprovalConfigDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  approvalLevel: number;

  @IsNumber()
  minAmount: number;

  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @IsOptional()
  @IsBoolean()
  autoApprove?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // ✅ New: Businesses to map this config to
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  businessIds?: number[];
}
