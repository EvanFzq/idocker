import { Module } from '@nestjs/common';
import { DockerService } from './service';

@Module({
  providers: [DockerService],
  exports: [DockerService],
})
export class DockerModule {}
