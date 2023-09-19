import { Module } from '@nestjs/common';
import { ContainerController } from './controller';
import { ContainerService } from './service';
import { DockerModule } from '../docker';
import { ImageModule } from '../image';

@Module({
  imports: [DockerModule, ImageModule],
  controllers: [ContainerController],
  providers: [ContainerService],
})
export class ContainerModule {}
