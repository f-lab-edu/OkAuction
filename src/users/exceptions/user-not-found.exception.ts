import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(userId: number) {
    super(`ID ${userId} 유저를 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
