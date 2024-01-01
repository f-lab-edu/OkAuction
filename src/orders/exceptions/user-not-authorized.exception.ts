import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotAuthorizedException extends HttpException {
  constructor(userId: number, orderId: number) {
    super(
      `ID가 ${userId} 인 사용자는 ID가 ${orderId} 인 주문에 대한 접근 권한이 없습니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
