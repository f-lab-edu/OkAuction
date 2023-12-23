import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductAlreadySoldException extends HttpException {
  constructor(productId: number) {
    super(
      `ID ${productId} 제품은 이미 판매되었습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
