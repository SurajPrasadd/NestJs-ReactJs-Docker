import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateContractDto {
  @IsNotEmpty()
  prNumber: string; // From PurchaseRequest.prNumber

  @IsOptional()
  @IsDateString()
  endDate?: string; // optional date input (ISO string)
}
