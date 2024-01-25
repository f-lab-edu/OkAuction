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
    return await this.productsRepository.manager.transaction(
      async (manager) => {
        // 비관적 락을 사용하여 상품 조회
        const product = await manager
          .createQueryBuilder(Product, 'product')
          .setLock('pessimistic_write')
          .where('product.id = :id', { id: createBidDto.products_id })
          .getOne();

        if (!product) {
          throw new ProductNotFoundException(createBidDto.products_id);
        }

        // 기존 로직...
        const currentTime = new Date();
        if (
          currentTime < product.start_time ||
          currentTime > product.end_time
        ) {
          throw new BidNotAllowedException();
        }

        // 최소 입찰가 계산 로직...
        const minBidAmount = product.highest_bid
          ? (BigInt(product.highest_bid) * BigInt(101)) / BigInt(100)
          : BigInt(product.p_b_price);

        if (BigInt(createBidDto.amount) < minBidAmount) {
          throw new InvalidBidException();
        }

        // 입찰 생성 및 저장
        const newBid = this.bidsRepository.create(createBidDto);
        await manager.save(newBid);

        // 상품의 최고 입찰가 갱신
        product.highest_bid = createBidDto.amount;
        await manager.save(product);

        return newBid;
      },
    );
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
  }): Promise<string> {
    const bid = await this.bidsRepository.findOneBy({ id: bidId });
    if (!bid) {
      throw new BidNotFoundException(bidId);
    }

    if (bid.user_id !== userId) {
      throw new UnauthorizedBidAccessException();
    }
    await this.bidsRepository.delete(bidId);

    return 'success';
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
