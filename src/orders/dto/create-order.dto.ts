import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderShipping } from '../enums/order-shipping.enum';

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

  @IsIn(Object.values(OrderStatus))
  o_status: OrderStatus;

  @IsIn(Object.values(OrderShipping))
  o_shipping: OrderShipping;
}
