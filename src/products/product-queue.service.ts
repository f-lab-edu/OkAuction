import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ProductQueueService {
  constructor(@InjectQueue('productQueue') private productQueue: Queue) {}

  async addAuctionEndJob(
    productId: number,
    endTime: Date,
    userId: number,
    highest_bid: number,
  ) {
    // 경매 종료 시간을 기준으로 작업을 스케줄링
    await this.productQueue.add(
      'endAuction', // 작업 식별자
      { productId, userId, highest_bid }, // 작업에 전달할 데이터
      {
        delay: endTime.getTime() - new Date().getTime(), // 현재 시간부터 경매 종료 시간까지의 지연 시간 계산
      },
    );
  }

  async addAuctionStartJob(productId: number, startTime: Date) {
    const now = new Date();
    if (startTime.getTime() > now.getTime()) {
      console.log('경매 시작 시간이 현재 시간보다 늦습니다.');
      // 경매 시작 시간을 기준으로 작업을 스케줄링
      await this.productQueue.add(
        'startAuction', // 작업 식별자
        { productId }, // 작업에 전달할 데이터
        {
          delay: startTime.getTime() - new Date().getTime(), // 현재 시간부터 경매 시작 시간까지의 지연 시간 계산
        },
      );
    } else {
      // 경매 시작 시간이 현재 시간보다 빠른 경우, 바로 경매 시작
      console.log('경매 시작 시간이 현재 시간보다 빠릅니다.' + productId);
      await this.productQueue.add('startAuction', { productId });
    }
  }
}
