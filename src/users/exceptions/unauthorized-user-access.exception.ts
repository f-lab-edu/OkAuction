import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedUserAccessException extends HttpException {
  constructor() {
    super('사용자 인가 실패', HttpStatus.FORBIDDEN);
  }
}
