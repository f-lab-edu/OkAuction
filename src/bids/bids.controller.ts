import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './bid.entity';
import { BidsService } from './bids.service';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  create(@Body() createBidDto: CreateBidDto): Promise<Bid> {
    return this.bidsService.placeBid(createBidDto);
  }

  @Get()
  findAll(): Promise<Bid[]> {
    return this.bidsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Bid> {
    return this.bidsService.findOne(id);
  }

  @Delete(':bidId')
  remove(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body('userId') userId: number,
  ): Promise<void> {
    return this.bidsService.remove({ bidId, userId });
  }

  @Get('product/:productId')
  async getBidsByProduct(
    @Param('productId') productId: number,
  ): Promise<Bid[]> {
    return this.bidsService.getBidsByProduct(productId);
  }

  @Get('user/:userId')
  async getBidsByUser(@Param('userId') userId: number): Promise<Bid[]> {
    return this.bidsService.getBidsByUser(userId);
  }
}
