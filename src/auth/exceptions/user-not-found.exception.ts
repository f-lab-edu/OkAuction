import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super('존재하지 않는 아이디입니다.', HttpStatus.NOT_FOUND);
  }
}
