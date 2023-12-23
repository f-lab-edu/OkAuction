import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryNotFoundException extends HttpException {
  constructor(categoryId: number) {
    super(
      `ID ${categoryId} 카테고리를 찾을 수 없습니다.`,
      HttpStatus.NOT_FOUND,
    );
  }
}
