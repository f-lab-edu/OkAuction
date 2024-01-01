import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientFundsException extends HttpException {
  constructor() {
    super('거래를 위한 잔액이 부족합니다.', HttpStatus.BAD_REQUEST);
  }
}
