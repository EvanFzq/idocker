import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from './src/app.module';
import { json, urlencoded } from 'express';
import { LoggerInterceptor, TransformInterceptor } from '@/interceptors';
import { HttpExceptionFilter } from '@/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  console.info('server start : 127.0.0.1:3580');

  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors =>
        new HttpException(
          'params error,property:' + errors.map(error => error.property).join(','),
          HttpStatus.BAD_REQUEST,
        ),
    }),
  );
  app.useGlobalInterceptors(new LoggerInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3580);
}
bootstrap();
