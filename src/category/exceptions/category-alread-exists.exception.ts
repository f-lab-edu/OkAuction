import { HttpException, HttpStatus } from '@nestjs/common';

export class CategoryAlreadyExistsException extends HttpException {
  constructor(categoryName: string) {
    super(
      `name이 ${categoryName} 인 카테고리가 이미 존재합니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
