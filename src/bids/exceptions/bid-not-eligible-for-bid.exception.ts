import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotEligibleForBidException extends HttpException {
  constructor(userId: number) {
    super(
      `ID ${userId} 유저는 입찰이 불가능한 상태입니다.`,
      HttpStatus.FORBIDDEN,
    );
  }
}
