import { Module } from '@nestjs/common';

import { ContainerController } from './controller';
import { ContainerService } from './service';
import { DockerModule } from '../docker';
import { ImageModule } from '../image';
import { NetworkModule } from '../network';

@Module({
  imports: [DockerModule, ImageModule, NetworkModule],
  controllers: [ContainerController],
  providers: [ContainerService],
  exports: [ContainerService],
})
export class ContainerModule {}
