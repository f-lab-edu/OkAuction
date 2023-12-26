import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserCredentialsException extends HttpException {
  constructor() {
    super('잘못된 사용자 자격 증명', HttpStatus.UNAUTHORIZED);
  }
}
