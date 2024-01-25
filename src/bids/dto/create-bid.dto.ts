import { IsNumber, IsOptional, IsDate, IsString } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  products_id: number;

  @IsString()
  amount: string;

  @IsDate()
  @IsOptional()
  bids_at?: Date;
}
