import { HttpException, HttpStatus } from '@nestjs/common';
//카테고리의 필수 속성이 누락되었거나 잘못된 데이터가 전달되었을 때 발생하는 예외
export class InvalidCategoryException extends HttpException {
  constructor(message: string) {
    super(`유효하지 않은 카테고리: ${message}`, HttpStatus.BAD_REQUEST);
  }
}
