import { HttpException, HttpStatus } from '@nestjs/common';

export class BidNotAllowedException extends HttpException {
  constructor() {
    super('입찰 가능시간이 아닙니다.', HttpStatus.FORBIDDEN);
  }
}
