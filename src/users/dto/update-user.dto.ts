import {
  IsString,
  IsOptional,
  IsEmail,
  Length,
  IsNumber,
  IsIn,
} from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { UserSignout } from '../enums/user-signout.enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Length(1, 50)
  u_id?: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  u_social?: string;

  @IsString()
  @IsOptional()
  @Length(5, 150)
  u_password?: string;

  @IsEmail()
  @IsOptional()
  @Length(0, 50)
  u_email?: string;

  @IsString()
  @IsOptional()
  @Length(1, 20)
  u_name?: string;

  @IsString()
  @IsOptional()
  @Length(1, 15)
  u_jumin?: string;

  @IsString()
  @IsOptional()
  @Length(0, 15)
  u_phone?: string;

  @IsNumber()
  @IsOptional()
  u_addr_postcode?: number;

  @IsString()
  @IsOptional()
  @Length(1, 200)
  u_address?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  u_address_sub?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  u_nickname?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  u_account?: string;

  @IsNumber()
  @IsOptional()
  u_point?: number;

  @IsIn(Object.values(UserRole))
  @IsOptional()
  u_role?: UserRole;

  @IsIn(Object.values(UserSignout))
  @IsOptional()
  u_signout?: UserSignout;
}
