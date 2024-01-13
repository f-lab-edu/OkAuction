import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidOrderStatusException extends HttpException {
  constructor(status: string) {
    super(`주문상태가 ${status} 상태입니다.`, HttpStatus.BAD_REQUEST);
  }
}
