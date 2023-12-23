import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidProductStateException extends HttpException {
  constructor(productId: number, state: string) {
    super(
      `ID ${productId} 제품은 현재 ${state} 상태입니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
