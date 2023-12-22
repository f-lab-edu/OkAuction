import { IsOptional, IsInt, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsInt()
  @Min(1)
  c_id: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  c_id2: number | null;

  @IsString()
  c_name: string;
}
