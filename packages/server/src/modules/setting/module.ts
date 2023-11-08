import { Module } from '@nestjs/common';

import { DockerModule } from '@/modules/docker';
import { ConfigModule } from '@/modules/config';

import { SettingService } from './service';
import { SettingController } from './controller';

@Module({
  imports: [DockerModule, ConfigModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
