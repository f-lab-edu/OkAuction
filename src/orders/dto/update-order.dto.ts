import { IsString, IsOptional, IsNumber, IsIn } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderShipping } from '../enums/order-shipping.enum';

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

  @IsIn(Object.values(OrderStatus))
  @IsOptional()
  o_status?: OrderStatus;

  @IsIn(Object.values(OrderShipping))
  @IsOptional()
  o_shipping?: OrderShipping;
}
