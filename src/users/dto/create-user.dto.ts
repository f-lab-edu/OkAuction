import {
  IsString,
  IsOptional,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  u_id: string;

  @IsString()
  @IsOptional()
  @Length(0, 100)
  u_social?: string;

  @IsString()
  @Length(5, 150)
  u_password: string;

  @IsEmail()
  @IsOptional()
  @Length(0, 50)
  u_email?: string;

  @IsString()
  @Length(1, 20)
  u_name: string;

  @IsString()
  @Length(1, 15)
  u_jumin: string;

  @IsString()
  @IsOptional()
  @Length(0, 15)
  u_phone?: string;

  @IsNumber()
  u_addr_postcode: number;

  @IsString()
  @Length(1, 200)
  u_address: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  u_address_sub?: string;

  @IsString()
  @Length(1, 50)
  u_nickname: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  u_account?: string;

  @IsNumber()
  @IsOptional()
  u_point?: number;

  @IsEnum(['Admin', 'User', 'Guest'])
  u_role: string;

  @IsEnum(['Y', 'N'])
  u_signout: string;
}
