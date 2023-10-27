import { Module } from '@nestjs/common';

import { NetworkController } from './controller';
import { NetworkService } from './service';
import { DockerModule } from '../docker';

@Module({
  imports: [DockerModule],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
