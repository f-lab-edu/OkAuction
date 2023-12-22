import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('======================');
    console.log('에외 발생~!');
    console.log('예외 메시지: ', message);
    console.log('예외 코드: ', status);
    console.log('======================');
  }
}
