import { Module } from '@nestjs/common';

import { ContainerController } from './controller';
import { ContainerService } from './service';
import { ContainerGateway } from './gateway';
import { DockerModule } from '../docker';
import { ImageModule } from '../image';
import { NetworkModule } from '../network';

@Module({
  imports: [DockerModule, ImageModule, NetworkModule],
  controllers: [ContainerController],
  providers: [ContainerService, ContainerGateway],
  exports: [ContainerService],
})
export class ContainerModule {}
