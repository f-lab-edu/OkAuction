import { IsOptional, IsInt, IsString, Min } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  c_id2?: number | null;

  @IsOptional()
  @IsString()
  c_name?: string;
}
