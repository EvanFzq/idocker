import path from 'path';

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { ContainerModule } from '@/modules/container';
import { ImageModule } from '@/modules/image';
import { NetworkModule } from '@/modules/network';
import { VolumeModule } from '@/modules/volume';
import { AuthModule } from '@/modules/auth/module';
import { AssetModule } from '@/modules/asset';
import { SettingModule } from '@/modules/setting';
import { ConfigModule } from '@/modules/config';
import { JwtAuthGuard } from '@/guards';

@Module({
  imports: [
    ContainerModule,
    AuthModule,
    ImageModule,
    NetworkModule,
    VolumeModule,
    AssetModule,
    SettingModule,
    ConfigModule,
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
