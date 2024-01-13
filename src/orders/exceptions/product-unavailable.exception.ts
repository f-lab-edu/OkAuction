import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductUnavailableException extends HttpException {
  constructor(productId: number) {
    super(
      `ID가 ${productId} 인 상품을 이용할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
