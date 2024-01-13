import { HttpException, HttpStatus } from '@nestjs/common';

export class UserDeletionException extends HttpException {
  constructor(userId: number, belonging: string) {
    super(
      `ID ${userId}인 유저에 진행 중인 ${belonging}이 있어 삭제할 수 없습니다.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
