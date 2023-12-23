import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor(productId: number) {
    super(`ID ${productId} 제품을 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
