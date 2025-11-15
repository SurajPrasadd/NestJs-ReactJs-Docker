import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  groupName?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
