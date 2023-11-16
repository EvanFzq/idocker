import { Module } from '@nestjs/common';

import { DockerModule } from '@/modules/docker';
import { ConfigModule } from '@/modules/config';
import { EmailModule } from '@/modules/email';
import { ContainerModule } from '@/modules/container';

import { SettingService } from './service';
import { SettingController } from './controller';

@Module({
  imports: [DockerModule, ConfigModule, EmailModule, ContainerModule],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
