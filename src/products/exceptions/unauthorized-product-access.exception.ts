import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedProductAccessException extends HttpException {
  constructor(productId: number, userId: number) {
    super(
      `ID ${userId} 유저는 ID ${productId} 제품에 대한 권한이 없습니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
