import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryDeletionException extends HttpException {
  constructor(categoryId: number) {
    super(
      `ID ${categoryId}인 카테고리에 속해있는 제품들이 있어 삭제할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
