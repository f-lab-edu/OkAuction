import { HttpException, HttpStatus } from '@nestjs/common';

export class OrderNotFoundException extends HttpException {
  constructor(orderId: number) {
    super(`ID가 ${orderId} 인 주문을 찾을 수 없습니다.`, HttpStatus.NOT_FOUND);
  }
}
