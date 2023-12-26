import { HttpException, HttpStatus } from '@nestjs/common';

export class BidNotFoundException extends HttpException {
  constructor(bidId: number) {
    super(`ID ${bidId} 입찰건을 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
