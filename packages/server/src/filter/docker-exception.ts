import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

import { DockerException } from '@/constants/exception';

@Catch(DockerException)
export class DockerExceptionFilter implements ExceptionFilter {
  catch(exception: DockerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse() as Record<string, string | number>;
    console.error('response error:', status, res.code, res.msg);
    response.status(status).json({
      code: res.code,
      msg: res.msg,
    });
  }
}
