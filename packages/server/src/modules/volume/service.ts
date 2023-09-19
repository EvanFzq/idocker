import { Injectable } from '@nestjs/common';
import { DockerService } from '../docker';

@Injectable()
export class VolumeService {
  constructor(private readonly dockerService: DockerService) {}
  async getVolumeList() {
    return this.dockerService.docker.listVolumes();
  }
}
