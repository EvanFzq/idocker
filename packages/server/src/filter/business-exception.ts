import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { BusinessException } from '@/constants/exception';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const res = exception.getResponse() as Record<string, string | number>;
    console.error('response error:', 'BusinessException', HttpStatus.OK, res.code, res.msg);
    response.status(HttpStatus.OK).json({
      code: res.code,
      msg: res.msg,
      error: res.error,
    });
  }
}
