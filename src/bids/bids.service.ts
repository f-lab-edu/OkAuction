import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async placeBid(createBidDto: CreateBidDto): Promise<Bid> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const product = await queryRunner.manager.findOneBy(Product, {
        id: createBidDto.products_id,
      });

      if (!product) {
        throw new ProductNotFoundException(createBidDto.products_id);
      }

      const currentTime = new Date();
      if (currentTime < product.start_time || currentTime > product.end_time) {
        throw new BidNotAllowedException();
      }

      const minBidAmount = product.highest_bid
        ? (BigInt(product.highest_bid) * BigInt(101)) / BigInt(100)
        : BigInt(product.p_b_price);

      if (BigInt(createBidDto.amount) < minBidAmount) {
        throw new InvalidBidException();
      }

      // 조건부 업데이트 실행
      const result = await queryRunner.manager
        .createQueryBuilder()
        .update(Product)
        .set({ highest_bid: createBidDto.amount })
        .where(
          'id = :id AND (highest_bid IS NULL OR highest_bid < :newBidAmount)',
          {
            id: product.id,
            newBidAmount: createBidDto.amount,
          },
        )
        .execute();

      // 업데이트된 행이 없으면 예외 발생
      if (result.affected === 0) {
        throw new InvalidBidException();
      }

      // 입찰 생성 및 저장
      const newBid = queryRunner.manager.create(Bid, { ...createBidDto });
      await queryRunner.manager.save(newBid);

      await queryRunner.commitTransaction();

      return newBid;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error; // 또는 사용자 정의 예외 처리
    } finally {
      await queryRunner.release();
    }
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
