import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBidDto } from './dto/create-bid.dto';
import { Bid } from './bid.entity';
import { Product } from 'src/products/product.entity';
import { ProductNotFoundException } from 'src/products/exceptions/product-not-found.exception';
import { BidNotAllowedException } from './exceptions/bid-not-allowed.exception';
import { InvalidBidException } from './exceptions/invalid-bid.exception';
import { BidNotFoundException } from './exceptions/bid-not-found.exception';
import { UnauthorizedBidAccessException } from './exceptions/unauthorized-bid-access.exception';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidsRepository: Repository<Bid>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async placeBid(createBidDto: CreateBidDto): Promise<Bid> {
    const product = await this.productsRepository.findOneBy({
      id: createBidDto.products_id,
    });

    if (!product) {
      throw new ProductNotFoundException(product.id);
    }

    // 경매가 진행중인지 확인
    const currentTime = new Date();
    if (currentTime < product.start_time || currentTime > product.end_time) {
      throw new BidNotAllowedException();
    }

    // 최소 입찰가보다 높은지 확인
    const minBidAmount = product.highest_bid
      ? product.highest_bid * 1.05
      : product.p_b_price;
    if (createBidDto.amount < minBidAmount) {
      throw new InvalidBidException();
    }

    const newBid = this.bidsRepository.create(createBidDto);
    await this.bidsRepository.save(newBid);

    product.highest_bid = createBidDto.amount;
    await this.productsRepository.save(product);

    return newBid;
  }

  async findAll(): Promise<Bid[]> {
    return this.bidsRepository.find();
  }

  findOne(id: number): Promise<Bid> {
    const bid = this.bidsRepository.findOneBy({ id: id });
    if (!bid) {
      throw new BidNotFoundException(id);
    }
    return bid;
  }

  async remove({
    bidId,
    userId,
  }: {
    bidId: number;
    userId: number;
  }): Promise<boolean> {
    const bid = await this.bidsRepository.findOneBy({ id: bidId });
    if (!bid) {
      throw new BidNotFoundException(bidId);
    }

    if (bid.user_id !== userId) {
      throw new UnauthorizedBidAccessException();
    }
    await this.bidsRepository.delete(bidId);

    return true;
  }

  async getBidsByProduct(productId: number): Promise<Bid[]> {
    return this.bidsRepository.find({ where: { products_id: productId } });
  }

  async getBidsByUser(userId: number): Promise<Bid[]> {
    return this.bidsRepository.find({ where: { user_id: userId } });
  }

  private isProductAvailableForBidding(product: Product): boolean {
    const currentTime = new Date();
    return currentTime > product.start_time && currentTime < product.end_time;
  }
}
