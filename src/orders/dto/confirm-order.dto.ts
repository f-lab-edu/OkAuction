import { IsString, IsOptional, IsNumber } from 'class-validator';

export class ConfirmOrderDto {
  @IsString()
  @IsOptional()
  o_req?: string;

  @IsString()
  @IsOptional()
  o_address?: string;

  @IsNumber()
  @IsOptional()
  o_addr_postcode?: number;

  @IsString()
  @IsOptional()
  o_address_sub?: string;
}
