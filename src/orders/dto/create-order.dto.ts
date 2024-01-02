import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  product_id: number;

  @IsString()
  @IsOptional()
  o_req?: string; // 기본값이 있으므로 Optional

  @IsString()
  o_address: string;

  @IsNumber()
  o_addr_postcode: number;

  @IsString()
  @IsOptional()
  o_address_sub?: string;

  @IsNumber()
  o_price: number;

  @IsNumber()
  @IsOptional()
  used_point?: number; // 기본값이 있으므로 Optional

  @IsIn(['Temp', 'Confirmed', 'End'])
  o_status: string;

  @IsIn(['Pending', 'Prepared', 'Shipped', 'Delivered', 'Returned'])
  o_shipping: string;
}
