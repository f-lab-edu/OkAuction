import { IsString, IsOptional, IsNumber, IsDate, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductSalesStatus } from '../enums/product-sales-status.enum';

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  c_id?: number;

  @IsNumber()
  @IsOptional()
  c_id2?: number;

  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsString()
  @IsOptional()
  p_name?: string;

  @IsString()
  @IsOptional()
  p_info?: string;

  @IsNumber()
  @IsOptional()
  p_b_price?: number;

  @IsNumber()
  @IsOptional()
  p_hit?: number;

  @IsNumber()
  @IsOptional()
  p_dur_date?: number;

  @IsIn(Object.values(ProductSalesStatus))
  @IsOptional()
  p_sales_status?: ProductSalesStatus;

  @IsString()
  @IsOptional()
  p_address?: string;

  @IsString()
  @IsOptional()
  p_address_sub?: string;

  @IsNumber()
  @IsOptional()
  p_addr_postcode?: number;

  @IsNumber()
  @IsOptional()
  p_like?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start_time?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end_time?: Date;

  @IsNumber()
  @IsOptional()
  highest_bid?: number;

  @IsString()
  @IsOptional()
  main_img_id?: string;
}
