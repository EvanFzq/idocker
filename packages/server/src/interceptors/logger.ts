/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // graphql
    if ((context as any).contextType === 'graphql') {
      return next.handle().pipe(data => data);
    } else {
      const ctx = context.switchToHttp();
      const req: Request = ctx.getRequest();
      const res: Response = ctx.getResponse();
      // 打印原始url，包括querystring
      console.info(
        req.method,
        req.originalUrl,
        req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip,
        req.headers['user-agent'],
      );

      return next.handle().pipe(tap(() => console.info('res', 'response data', res.statusCode)));
    }
  }
}
