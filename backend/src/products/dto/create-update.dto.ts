import { IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateUpdateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId?: number | null;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
