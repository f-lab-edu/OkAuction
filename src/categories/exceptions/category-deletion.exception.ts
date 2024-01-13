import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryDeletionException extends HttpException {
  constructor(categoryId: number, belonging: string) {
    super(
      `ID ${categoryId}인 카테고리에 속해있는 ${belonging}들이 있어 삭제할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
