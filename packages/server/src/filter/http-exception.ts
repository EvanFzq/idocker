import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      (exception.getResponse?.() as ErrorResponse)?.message ||
      exception.getResponse?.() ||
      exception.json?.message ||
      'unknow error';
    console.log(exception);
    console.log(exception.reason);
    console.log(exception.statusCode);
    console.log(exception.json);

    response.status(status).json({
      code: status,
      msg: message,
    });
  }
}
