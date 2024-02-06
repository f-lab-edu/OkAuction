import { HttpException, HttpStatus } from '@nestjs/common';

export class BidConflictException extends HttpException {
  constructor(msg: string) {
    super(msg, HttpStatus.FORBIDDEN);
  }
}
