import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(u_id: string) {
    super(`${u_id} 는 이미 존재하는 아이디입니다.`, HttpStatus.BAD_REQUEST);
  }
}
