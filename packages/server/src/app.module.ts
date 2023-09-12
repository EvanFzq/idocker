import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ContainerModule } from '@/modules/container';
import { AuthModule } from '@/modules/auth/module';
import { JwtAuthGuard } from '@/guards';
import path from 'path';

@Module({
    imports: [
        ContainerModule,
        AuthModule,
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '..', '..', 'web', 'dist'),
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
