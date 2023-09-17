import { Module } from '@nestjs/common';
import { ContainerController } from './controller';
import { ContainerService } from './service';
import { DockerModule } from '../docker';

@Module({
    imports: [DockerModule],
    controllers: [ContainerController],
    providers: [ContainerService],
})
export class ContainerModule {}
