import { Module } from '@nestjs/common';

import { ConfigModule } from '@/modules/config';
import { EmailModule } from '@/modules/email';

import { DockerService } from './service';

@Module({
  imports: [ConfigModule, EmailModule],
  providers: [DockerService],
  exports: [DockerService],
})
export class DockerModule {}
