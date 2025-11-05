import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateApprovalConfigBusinessDto {
  @IsInt()
  @IsNotEmpty()
  approvalConfigId: number;

  @IsInt()
  @IsNotEmpty()
  businessId: number;
}
