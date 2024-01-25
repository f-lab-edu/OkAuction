import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidProductTimeException extends HttpException {
  constructor() {
    super(
      `제품의 경매 시작 시간은 현재 시간보다 느려야 합니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
