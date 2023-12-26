import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductDeletionException extends HttpException {
  constructor(productId: number) {
    super(
      `ID ${productId}인 경매품에 입찰이 있어 삭제할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
