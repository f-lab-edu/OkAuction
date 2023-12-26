import { IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  products_id: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  start_price: number;

  @IsDate()
  @IsOptional()
  bids_at?: Date;
}
