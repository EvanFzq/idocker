import { Module } from '@nestjs/common';
import { VolumeController } from './controller';
import { VolumeService } from './service';
import { DockerModule } from '../docker';

@Module({
  imports: [DockerModule],
  controllers: [VolumeController],
  providers: [VolumeService],
})
export class VolumeModule {}
