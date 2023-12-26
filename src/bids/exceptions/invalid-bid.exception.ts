import { HttpException, HttpStatus } from '@nestjs/common';
// 입찰 금액이 유효하지 않거나 기준을 만족하지 못할 때 발생하는 예외
export class InvalidBidException extends HttpException {
  constructor() {
    super(`유효하지 않은 입찰가입니다.`, HttpStatus.BAD_REQUEST);
  }
}
