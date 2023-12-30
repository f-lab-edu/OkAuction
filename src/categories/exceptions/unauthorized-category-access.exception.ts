import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedCategoryAccessException extends HttpException {
  constructor() {
    super('카테고리 접근에 인가 실패했습니다.', HttpStatus.FORBIDDEN);
  }
}
