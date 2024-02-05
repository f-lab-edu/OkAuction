import { HttpException, HttpStatus } from '@nestjs/common';
// 입찰 금액이 유효하지 않거나 기준을 만족하지 못할 때 발생하는 예외
export class BidConflictException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.BAD_REQUEST);
  }
}
