import { IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  products_id: number;

  @IsNumber()
  amount: number;

  @IsDate()
  @IsOptional()
  bids_at?: Date;
}
