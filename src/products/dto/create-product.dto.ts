import { IsString, IsOptional, IsNumber, IsDate, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  c_id: number;

  @IsNumber()
  @IsOptional()
  c_id2?: number;

  @IsNumber()
  user_id: number;

  @IsString()
  @IsOptional()
  p_name?: string;

  @IsString()
  @IsOptional()
  p_info?: string;

  @IsNumber()
  p_direct: number;

  @IsDate()
  p_dur: Date;

  @IsNumber()
  p_b_price: number;

  @IsNumber()
  p_hit: number;

  @IsNumber()
  p_dur_date: number;

  @IsIn(['Available', 'Pending', 'Sold'])
  p_sales_status: string;

  @IsString()
  p_address: string;

  @IsString()
  @IsOptional()
  p_address_sub?: string;

  @IsNumber()
  p_addr_postcode: number;

  @IsNumber()
  p_like: number;

  @IsDate()
  start_time: Date;

  @IsDate()
  end_time: Date;

  @IsNumber()
  @IsOptional()
  highest_bid?: number;

  @IsString()
  @IsOptional()
  main_img_id?: string;
}
