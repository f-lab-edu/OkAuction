import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // HTTP 요청 컨텍스트를 가져옵니다. 이는 요청-응답 사이클에서 HTTP 요청과 응답을 나타내는 객체를 제공합니다.
    const res = ctx.getResponse<Response>(); // 응답 객체를 가져옵니다. (Express의 res 객체와 동일합니다.)
    const req = ctx.getRequest<Request>(); // 요청 객체를 가져옵니다. (Express의 req 객체와 동일합니다.)
    const status = exception.getStatus();
    const message = exception.getResponse();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException(); // 예외가 HttpException이 아닌 경우, InternalServerErrorException으로 변환합니다.
    }

    console.log('======================');
    console.log('에외 발생~!');
    console.log('예외 메시지: ', message);
    console.log('요청 url: ', req.url);
    console.log('======================');

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
