import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { messageMap } from './message';

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception.getStatus?.() || exception.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception.getResponse?.() as ErrorResponse)?.message ||
      exception.getResponse?.() ||
      exception.json?.message ||
      'unknow error';

    console.error('response error:', status, messageMap[message] || message, exception);

    response.status(status).json({
      code: status,
      msg: messageMap[message] || message,
    });
  }
}
