import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAccountSignoutException extends HttpException {
  constructor() {
    super('탈퇴한 유저입니다.', HttpStatus.FORBIDDEN);
  }
}
