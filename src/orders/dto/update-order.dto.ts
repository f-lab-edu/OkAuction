import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsString()
  @IsOptional()
  o_req?: string;

  @IsString()
  @IsOptional()
  o_address?: string;

  @IsString()
  @IsOptional()
  o_address_sub?: string;

  @IsNumber()
  @IsOptional()
  o_addr_postcode?: number;

  @IsNumber()
  @IsOptional()
  used_point?: number;

  @IsIn(['Temp', 'Confirmed', 'End'])
  @IsOptional()
  o_status?: string;

  @IsIn(['Pending', 'Prepared', 'Shipped', 'Delivered', 'Returned'])
  @IsOptional()
  o_shipping?: string;
}
