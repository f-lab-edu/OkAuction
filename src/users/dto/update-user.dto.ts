import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  u_id?: string;

  @IsString()
  @IsOptional()
  u_social?: string;

  @IsString()
  @IsOptional()
  u_password?: string;

  @IsString()
  @IsOptional()
  u_email?: string;

  @IsString()
  @IsOptional()
  u_name?: string;

  @IsString()
  @IsOptional()
  u_jumin?: string;

  @IsString()
  @IsOptional()
  u_phone?: string;

  @IsNumber()
  @IsOptional()
  u_addr_postcode?: number;

  @IsString()
  @IsOptional()
  u_address?: string;

  @IsString()
  @IsOptional()
  u_address_sub?: string;

  @IsString()
  @IsOptional()
  u_nickname?: string;

  @IsString()
  @IsOptional()
  u_account?: string;

  @IsNumber()
  @IsOptional()
  u_point?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  u_created_at?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  u_updated_at?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  u_suspension?: Date;

  @IsEnum(['Admin', 'User', 'Guest'])
  @IsOptional()
  u_role?: string;

  @IsEnum(['Y', 'N'])
  @IsOptional()
  u_signout?: string;
}
