import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateApprovalConfigBusinessDto {
  @IsInt()
  @IsNotEmpty()
  approvalConfigId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  groupName: string;
}
