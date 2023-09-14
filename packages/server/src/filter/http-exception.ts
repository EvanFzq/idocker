import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const message =
            (exception.getResponse() as ErrorResponse)?.message || exception.getResponse();

        response.status(status).json({
            code: status,
            msg: message,
        });
    }
}
