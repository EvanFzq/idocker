import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from './src/app.module';
import { LoggerInterceptor, TransformInterceptor } from '@/interceptors';
import { HttpExceptionFilter } from '@/filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    console.log('server start : 127.0.0.1:3580');

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
    app.enableCors({
        origin: ['http://localhost:5173'],
        allowedHeaders: ['token', 'content-type'],
    });
    await app.listen(3580);
}
bootstrap();
