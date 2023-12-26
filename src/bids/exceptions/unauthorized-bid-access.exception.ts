import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedBidAccessException extends HttpException {
  constructor() {
    super('해당 입찰에 접근 권한이 없습니다.', HttpStatus.FORBIDDEN);
  }
}
