import { HttpException, HttpStatus } from '@nestjs/common';
// Product를 생성하다 발생한 예외는 Product의 책임이므로.
export class InvalidCategoryException extends HttpException {
  constructor(categoryId: number) {
    super(
      `ID가 ${categoryId} 인 카테고리는 유효하지 않거나 존재하지 않습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
