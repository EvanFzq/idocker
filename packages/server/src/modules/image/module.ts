import { Module } from '@nestjs/common';
import { ImageController } from './controller';
import { ImageService } from './service';
import { DockerModule } from '../docker';

@Module({
    imports: [DockerModule],
    controllers: [ImageController],
    providers: [ImageService],
})
export class ImageModule {}
