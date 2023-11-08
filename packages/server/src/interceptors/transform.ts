/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Request, Response } from 'express';

interface IHttpData<T> {
  statusCode: number;
  message: string;
  data: T;
}

type TransformFunc = (data: any, req: Request, res: Response) => any;

function defaultTransformFunc(data: any): any {
  const msg = 'Success';
  return {
    code: 0,
    msg,
    data,
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, IHttpData<T>> {
  transformFunc: TransformFunc;
  constructor(transformFunc: TransformFunc = defaultTransformFunc) {
    this.transformFunc = transformFunc;
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<IHttpData<T>>> {
    const ctx = context.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();

    let statusCode = res.statusCode || HttpStatus.OK;
    // 将 201 修改为 200
    if (req.method === 'POST' && statusCode === HttpStatus.CREATED) {
      res.statusCode = statusCode = HttpStatus.OK;
    }
    const ignoreList = [
      {
        path: '/api/v1/asset/img',
        method: 'GET',
      },
      {
        path: '/api/v1/asset/wallpaper',
        method: 'GET',
      },
    ];

    if (
      ignoreList.some(item => req.originalUrl.startsWith(item.path) && req.method === item.method)
    ) {
      // 文件不处理
      return next.handle();
    } else {
      return next.handle().pipe(map(data => this.transformFunc(data, req, res)));
    }
  }
}
