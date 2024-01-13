import { HttpException, HttpStatus } from '@nestjs/common';
import { ProductSalesStatus } from '../enums/product-sales-status.enum';

export class InvalidProductStateException extends HttpException {
  constructor(productId: number, state: ProductSalesStatus) {
    super(
      `ID ${productId} 제품은 현재 경매가 ${state} 상태입니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
